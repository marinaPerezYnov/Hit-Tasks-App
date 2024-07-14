<?php

namespace App\Controller;

use App\Entity\ListMembers;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\Persistence\ManagerRegistry;

class ListMembersController extends AbstractController
{
    public function __construct(private ManagerRegistry $doctrine) {
    }

    #[Route(path: '/getAllListMembers', name: 'app_get_all_list_member', methods: ['GET'])]
    public function getAllListMembers(Request $request): Response
    {
        $userId = $request->query->get('userId');
        $allMembers = $this->doctrine->getRepository(ListMembers::class)->findBy(['userId' => $userId]);

        return $this->json(
            (object)[
                'data' => $allMembers,
            ]
        );
    }

    #[Route(path: '/deleteOneMember', name: 'app_delete_one_Member', methods: ['DELETE'])]
    public function deleteOneMember(Request $request): Response
    {
        //TODO: Implémenter une fonction qui va permettre de supprimer un Historic
        $data = json_decode($request->getContent(), true);
        $deleteMember = $this->doctrine->getRepository(ListMembers::class)->findOneBy(['id' => $data['id']]);
        $em = $this->doctrine->getManager();
        $em->remove($deleteMember);
        $em->flush();
        return $this->json(
            (object)[
                'data' => $deleteMember,
            ]
        );
    }
}
