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

        // Generate refresh token
        $refreshToken = $refreshTokenGenerator->generate();
        $user->addRefreshToken(new RefreshToken($user, $refreshToken));

        // Persist refresh token
        $entityManager = $this->doctrine->getManager();
        $entityManager->persist($user);
        $entityManager->flush();

        return [
            'accessToken' => $accessToken,
            'refreshToken' => $refreshToken
        ];
    }

    public function refreshToken(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $refreshToken = $data['refreshToken'];

        // Validate refresh token
        $refreshTokenEntity = $this->doctrine->getRepository(RefreshToken::class)->findOneBy(['refreshToken' => $refreshToken]);
        if (!$refreshTokenEntity) {
            return new JsonResponse(['error' => 'Invalid refresh token'], 401);
        }

        // Generate new access token based on refresh token
        $user = $refreshTokenEntity->getUser();
        $newAccessToken = $this->jwtManager->create($user);

        // Invalidate old refresh token
        $refreshTokenEntity->setInvalidated(true);

        // Persist changes
        $entityManager = $this->doctrine->getManager();
        $entityManager->persist($refreshTokenEntity);
        $entityManager->flush();

        return new JsonResponse(['accessToken' => $newAccessToken]);
    }

    #[Route(path:'/register', name: 'app_register', methods: ['POST', 'GET'])]
    public function register(Request $request, UserPasswordHasherInterface $passwordHasher, JWTTokenManagerInterface $jwtManager):JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $plainPassword = $data['password'];
        $user = new User();
        $user->setEmail($data['email']);
        // $user->setRoles(['USER']);
        $user->setWeekValue(0);
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
    public function login(Request $request, AuthenticationUtils $authenticationUtils): jsonResponse
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
        $userId = $userFindForTokenReceive->getId();
        // Générer le token
        $token = $this->generateToken($userFindForTokenReceive);
        return $this->json(
            (object)[
                'error' => $error,
                'lastUserName'=> $lastUsername,
                'token'=> $token,
                'userId'=> $userId
            ]
        );
    }
    
    #[Route(path: '/addValueTasksWeek', name:'app_value_tasks', methods: ['PUT'])]
    public function setValueTasksWeek(Request $request): jsonResponse
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
    public function userDetails(Request $request, $userId): jsonResponse
    {
        $valueTasksWeek = $this->doctrine->getRepository(User::class)->findOneBy(['id' => $userId]);

        return $this->json(
            (object)[
                'weekValue' => $valueTasksWeek->getWeekValue(),
                'userId' => $valueTasksWeek->getId(),
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
}
