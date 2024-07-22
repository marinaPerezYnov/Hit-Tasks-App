<?php

namespace App\Controller;

use App\Entity\Historic;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\Persistence\ManagerRegistry;

use DateTime;

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
        // Supposons que 'date' est défini et non vide
        if (isset($data['date']) && !empty($data['date'])) {
            // Convertir la chaîne de date en objet DateTime
            $dateString = $data['date'];
            $dateTime = DateTime::createFromFormat('Y-m-d\TH:i:s.v\Z', $dateString);

            if ($dateTime === false) {
                // Gérer l'erreur si la date est invalide
                return new Response("Invalid date format", Response::HTTP_BAD_REQUEST);
            }
        } else {
            $dateTime = null; // Ou gérer l'absence de date selon vos besoins
        }

        $historic = new Historic();
        $historic->setTaskId($data['taskId']);
        $historic->setDate($dateTime);
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
        //rajouter la familyKey pour récupérer les historiques de la famille
        $userId = $request->query->get('userId');
        $date = $request->query->get('date');
        $familyKey = $request->query->get('familyKey');

        //transformer la date au format YYYY-MM
        $formatDate = date('Y-m', strtotime($date));
        $allHistoric = [];

        $rightDateForHistoric=[];

        if($familyKey !== "null"){
            // Récupérer les utilisateurs correspondant à $familyKey
            $users = $this->doctrine->getRepository(User::class)->findBy(['familyKey' => $familyKey]);

            //boucler sur le tableau users pour récupérer les historiques de chaque utilisateur

            for($i=0; $i<count($users); $i++){
                $allHistoric[] = $this->doctrine->getRepository(Historic::class)->findBy(['userId' => $users[$i]->getId()]);
            }
        } else{
            $allHistoric = $this->doctrine->getRepository(Historic::class)->findBy(['userId' => $userId]);
        }

        foreach ($allHistoric as $index => $subArray) {
            if (!empty($subArray)) {
                foreach ($subArray as $historic) {
                    $dateTimeString = $historic->getDate()->format('Y-m-d H:i:s');
                    // Utiliser explode pour diviser la chaîne en fonction de l'espace
                    $parts = explode(' ', $dateTimeString);

                    // Vérifier les résultats
                    $date = $parts[0];
                    // Enlever les 3 derniers characters de $date
                    $date = substr($date, 0, -3);
                    $time = $parts[1];

                    if($date === $formatDate){
                     $rightDateForHistoric[] = $historic;
                    }
                }
                $allHistoric[$index] = $rightDateForHistoric;
            }
        }

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
