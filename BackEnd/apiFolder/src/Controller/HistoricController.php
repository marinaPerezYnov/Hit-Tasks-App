<?php

namespace App\Controller;

use App\Entity\Historic;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\Persistence\ManagerRegistry;

class HistoricController extends AbstractController
{
    public function __construct(private ManagerRegistry $doctrine) {
    }
    /*
        public function __construct(private ManagerRegistry $doctrine) {
    }
    */
    #[Route(path: '/addHistoric', name: 'app_add_historic', methods: ['GET','POST'])]
    public function addHistoric(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);

        $historic = new Historic();
        $historic->setDate($data['date']);
        $historic->setValueTasksCompleted($data['valueTasksCompleted']);
        $historic->setUserId($data['userId']);
        $entityManager = $this->doctrine->getManager();
        $entityManager->persist($historic);
        $entityManager->flush();

        return $this->json(
            (object)[
                'data' => $historic,
            ]
        );
    }

    #[Route(path: '/getAllHistoric', name: 'app_get_all_historic', methods: ['GET'])]
    public function getAllHistoric(Request $request): Response
    {
        $userId = $request->query->get('userId');
        $date = $request->query->get('date');

        $allHistoric = $this->doctrine->getRepository(Historic::class)->findBy(['date' => $date, 'userId' => $userId]);

        return $this->json(
            (object)[
                'data' => $allHistoric,
            ]
        );
    }

    #[Route(path: '/deleteOneHistoric', name: 'app_delete_one_Historic', methods: ['DELETE'])]
    public function deleteOneHistoric(Request $request): Response
    {
        //TODO: Implémenter une fonction qui va permettre de supprimer un Historic
        $data = json_decode($request->getContent(), true);
        $deleteHistoric = $this->doctrine->getRepository(Historic::class)->findOneBy(['id' => $data]);
        $em = $this->doctrine->getManager();
        $em->remove($deleteHistoric);
        $em->flush();
        return $this->json(
            (object)[
                'data' => $deleteHistoric,
            ]
        );
    }
}
