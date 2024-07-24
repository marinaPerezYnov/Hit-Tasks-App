<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Tasks;
use App\Entity\Historic;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
class RegistrationController extends AbstractController
{
    private $passwordHasher;
    private $jwtManager;
    public function __construct(private ManagerRegistry $doctrine, UserPasswordHasherInterface $passwordHasher, JWTTokenManagerInterface $jwtManager) {
        $this->passwordHasher = $passwordHasher;
        $this->jwtManager = $jwtManager;
    }

    function generateToken(User $user): string
    {
        $accessToken = $this->jwtManager->create($user);

        // Persist refresh token
        $entityManager = $this->doctrine->getManager();
        $entityManager->persist($user);
        $entityManager->flush();

        return $accessToken;
    }

    public const REGISTER_ROUTE = 'app_register';
    #[Route(path:'/register', name: self::REGISTER_ROUTE, methods: ['POST', 'GET'])]
    public function register(Request $request, UserPasswordHasherInterface $passwordHasher, JWTTokenManagerInterface $jwtManager):JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $plainPassword = $data['password'];
        $user = new User();
        $user->setEmail($data['email']);

        if($data['familyKey']){
            // verifier également si le code famille existe déjà et si l'adress email est déjà enregistrée dans la table de User à la colonne list_Members
            // $user = $this->doctrine->getRepository(User::class)->findOneBy(['family_key' => $data['familyKey']]);
            $user->setFamilyKey($data['familyKey']);
        }
        $user->setWeekValue(0);
        $user->setSubscriptionKey(0);

        // Encoder le mot de passe
        $encodedPassword = $this->passwordHasher->hashPassword(
            $user,
            $plainPassword
        );
        $user->setPassword($encodedPassword); // enregistrer le password seulement une fois crypté
        // echo $user;
        $entityManager = $this->doctrine->getManager();
        $entityManager->persist($user);
        $entityManager->flush();
        
        // Récupérer l'utilisateur depuis la base de données
        $userFindForTokenReceive = $this->doctrine->getRepository(User::class)->findOneBy(['email' => $data['email']]);
        // Générer le token
        $token = $this->generateToken($userFindForTokenReceive);

        return new JsonResponse([
            'token'=>$token,
            'userId'=>$user->getId()
        ]);
    }
    
    public const LOGIN_ROUTE = 'app_login';

    #[Route(path: '/login', name: self::LOGIN_ROUTE, methods: ['POST','GET'])]
    public function login(Request $request, AuthenticationUtils $authenticationUtils): JsonResponse
    {
        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();
        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();
        $data = json_decode($request->getContent(), true);
        // Récupérer l'utilisateur depuis la base de données

        $userFindForTokenReceive = $this->doctrine->getRepository(User::class)->findOneBy(
            ['email' => $data['email']]
        );
        $token = $this->generateToken($userFindForTokenReceive);

        $userId = $userFindForTokenReceive->getId();
        $familyKey = $userFindForTokenReceive->getFamilyKey();
        $subscriptionKey = $userFindForTokenReceive->getSubscriptionKey();
        // var_dump($userFindForTokenReceive);
        return new JsonResponse([
          'error' => $error,
          'lastUserName' => $lastUsername,
          'familyKey' => $familyKey,
          'subscriptionKey' => $subscriptionKey,
          'token' => $token,
          'userId' => $userId
        ]);
    }
    
    #[Route(path: '/addValueTasksWeek', name:'app_value_tasks', methods: ['PUT'])]
    public function setValueTasksWeek(Request $request): JsonResponse
    {
        //TODO: Implémenter une fonction qui va permettre d'ajouter une valeur de tâches par semaine à un utilisateur
        $data = json_decode($request->getContent(), true);
        $valueTasksWeek = $this->doctrine->getRepository(User::class)->findOneBy(['id' => $data['userId']]);
        $valueTasksWeek->setWeekValue($data['weekValue']);
        $entityManager = $this->doctrine->getManager();
        $entityManager->persist($valueTasksWeek);
        $entityManager->flush();

        return $this->json(
            (object)[
                'data' => $valueTasksWeek,
            ]
        );
    }

    #[Route(path: '/userDetails/{userId}', name:'app_user_details', methods: ['GET'])]
    public function userDetails(Request $request, $userId): JsonResponse
    {
        $valueTasksWeek = $this->doctrine->getRepository(User::class)->findOneBy(['id' => $userId]);

        return $this->json(
            (object)[
                'weekValue' => $valueTasksWeek->getWeekValue(),
                'userId' => $valueTasksWeek->getId(),
            ]
        );
    }

    //route pour modifier son type d'abonnement (0 = gratuit, 1 = payant, 2 = famille)
    #[Route(path: '/updateSubscriptionKey/{userId}', name: 'app_update_subscription_key', methods: ['PUT'])]
    public function updateSubscriptionKey(Request $request, $userId): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $updateSubscriptionKey = $this->doctrine->getRepository(User::class)->findOneBy(['id' => $userId]);
        $updateSubscriptionKey->setSubscriptionKey($data['subscriptionKey']);
        $updateSubscriptionKey->setFamilyKey($data['familyKey']);

        $entityManager = $this->doctrine->getManager();
        $entityManager->persist($updateSubscriptionKey);
        $entityManager->flush();
        return $this->json(
            (object)[
                'data' => $updateSubscriptionKey,
            ]
        );
    }

    #[Route(path:'/deleteAccount', name: 'app_delete_account', methods: ['DELETE'])]
    public function deleteAccount(Request $request):JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Récupérer l'utilisateur depuis la base de données
        $user = $this->doctrine->getRepository(User::class)->findOneBy(['id' => $data]);
        $tasksUser = $this->doctrine->getRepository(Tasks::class)->findOneBy(['user_id' => $data]);
        $historicUser = $this->doctrine->getRepository(Historic::class)->findOneBy(['user_id' => $data]);
      
        $entityManager = $this->doctrine->getManager();
        $entityManager->remove($user);

        $entityManager->flush();
    
        return new JsonResponse([
            'status'=>'Compte supprimé',
        ]);
    }

    //route pour récupérer le nombre aléatoire de type familyKey envoyé et verifier s'il existe dans la base de données s'il existe déjà on renvoi un message d'erreur
    #[Route(path: '/checkFamilyKey', name: 'app_check_family_key', methods: ['POST','GET'])]
    public function checkFamilyKey(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if($data['familyKey'] !== null){
            $users = $this->doctrine->getRepository(User::class)->findBy(['familyKey' => $data['familyKey']]);
                if($users){
                    return new JsonResponse([
                        'status'=>'Ce code existe déjà',
                    ]);
                }else{
                return new JsonResponse([
                    'status'=>'Le code est disponible',
                ]);
            }
        }
    }
}
