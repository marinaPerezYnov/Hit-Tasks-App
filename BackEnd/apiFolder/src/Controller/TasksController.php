<?php

namespace App\Controller;

use App\Entity\Tasks;
use App\Entity\Historic;
use App\Entity\User;
use App\Repository\TasksRepository;
use App\Repository\HistoricRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\Persistence\ManagerRegistry;
use DateTime;

class TasksController extends AbstractController
{
    private $jwtManager;
    public function __construct(private ManagerRegistry $doctrine) {
    }

    #[Route(path: '/addTasks', name: 'app_add_tasks', methods: ['GET','POST'])]
    public function addTasks(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        $tasks = new Tasks();

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

        $tasks->setName($data['name']);
        $tasks->setTaskValue($data['taskValue']);
        $tasks->setUserId($data['userId']);
        $tasks->setTime($data['time']);
        $tasks->setDate($dateTime);
        
        $entityManager = $this->doctrine->getManager();
        $entityManager->persist($tasks);
        $entityManager->flush();

        return $this->json(
            (object)[
                'data' => $tasks,
            ]
        );
    }

    #[Route(path: '/getAllTasks/{userId}&familyKey={familyKey}', name: 'app_get_all_tasks', methods: ['GET','POST'])]
    public function getAllTasks(Request $request, $userId, $familyKey): Response
    {
        //TODO: Implémenter une fonction qui va permettre de récupérer toutes les tasks de l'utilisateur avec l'ID $userId
        //Récupérer tous les id des utilisateurs qui ont la même familyKey
        $allTasks = [];

        if($familyKey != null){
            $allUserId = $this->doctrine->getRepository(User::class)->findBy(['familyKey' => $familyKey]);

            foreach ($allUserId as $userId) {
                $allTasks[] = $this->doctrine->getRepository(Tasks::class)->findBy(['userId' => $userId]);
            }
        }else{
            $allTasks = $this->doctrine->getRepository(Tasks::class)->findBy(['userId' => $userId]);
        }
        return $this->json(
            (object)[
                'data' => $allTasks,
            ]
        );
    }
    // Fonction pour définir au changement de status un nouvelle valeur de status récupérée depuis le front et qui va être enregistrée dans la base de données

    #[Route(path: '/updateStatusTasks', name: 'app_update_status_tasks', methods: ['PUT'])]
    public function updateStatusTasks(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        $updateStatusTasks = $this->doctrine->getRepository(Tasks::class)->findOneBy(['id' => $data['id']]);
        $updateStatusTasks->setStatus($data['status']);
        $entityManager = $this->doctrine->getManager();
        $entityManager->persist($updateStatusTasks);
        $entityManager->flush();
        return $this->json(
            (object)[
                'data' => $updateStatusTasks,
            ]
        );
    }

    #[Route(path: '/deleteOneTasks', name: 'app_delete_one_tasks', methods: ['DELETE'])]
    public function deleteOneTasks(Request $request): Response
    {
        //TODO: Implémenter une fonction qui va permettre de supprimer un post

        $data = json_decode($request->getContent(), true);
        //on récupére dans la table Historic le post qui a le même id que celui récupéré et on le supprime
        $deleteHistoric = $this->doctrine->getRepository(Historic::class)->findOneBy(['taskId' => $data]);

        //on récupére le post qui a le même id que celui récupéré 
        $deleteTasks = $this->doctrine->getRepository(Tasks::class)->findOneBy(['id' => $data]);

        $em = $this->doctrine->getManager();
        $em->remove($deleteHistoric);
        $em->remove($deleteTasks);
        $em->flush();
        return $this->json(
            (object)[
                'data' => $data,
            ]
        );
    }
}
