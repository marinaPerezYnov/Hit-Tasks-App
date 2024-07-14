<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\ListMembers;
use Symfony\Component\Routing\Annotation\Route;

use Doctrine\Persistence\ManagerRegistry;
use App\Service\ParrainageService;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Mailer\MailerInterface;


class MemberController extends AbstractController
{
    private $security;
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine, Security $security)
    {
        $this->security = $security;
        $this->doctrine = $doctrine;
    }

    #[Route('/createNewMember', name: 'app_create_member', methods: ['PUT'])]
    public function createNewMember(Request $request, MailerInterface $mailer): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $user = $this->doctrine->getRepository(User::class)->findOneBy(
            ['id' => $data['userId']]
        );

        $lengthOfArray = $this->doctrine->getRepository(ListMembers::class)->findBy(
            ['userId' => $data['userId']]
        );

        // Si lengthOfArray contient déjà l'email : $data['email'] alors on retourne un message d'erreur
        if($lengthOfArray){
            foreach ($lengthOfArray as $value) {
                if($value->getEmail() == $data['email']){
                    return new JsonResponse(['message' => 'This email already exists'], 400);
                }
            }
        } else {
            if (count($lengthOfArray) <= 5) {
                $arrOfMembers = new ListMembers();
    
                /* Utiliser le service d'envoi de mail pour envoi un email du parrain au parrainé */
                $parrainageService = new ParrainageService($mailer);

                $parrainageService->envoyerNotificationParrainage($user->getEmail(), $data['email'], $user->getFamilyKey());  
                
                $arrOfMembers->setEmail($data['email']);
                $arrOfMembers->setUserId($data['userId']);
                $arrOfMembers->setFamilyKey($user->getFamilyKey());

                $entityManager = $this->doctrine->getManager();
                $entityManager->persist($user);
                $entityManager->persist($arrOfMembers);
                $entityManager->flush();
                
                return new JsonResponse(['message' => 'Member created successfully'], 201);
            } else {
                return new JsonResponse(['message' => 'You have reached the maximum number of members'], 400);
            }
        }

    }


    #[Route('/getAllMembers', name: 'app_get_all_members', methods: ['GET'])]
    public function getAllMembers($userId, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $membersData = $this->doctrine->getRepository(User::class)->findOneById($userId);
        $memberListValue = $membersData->getListMembers();

        return $this->json(
            (object)[
                'data' => $memberListValue,
            ]
        );
    }
}
