<?php

namespace App\Controller;

use App\Entity\Tasks;
use App\Entity\Historic;
use App\Repository\TasksRepository;
use App\Repository\HistoricRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\Persistence\ManagerRegistry;

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
        $tasks->setName($data['name']);
        $tasks->setTaskValue($data['taskValue']);
        $tasks->setUserId($data['userId']);
        $tasks->setDate($data['date']);
        $tasks->setTime($data['time']);
        
        $entityManager = $this->doctrine->getManager();
        $entityManager->persist($tasks);
        $entityManager->flush();

        return $this->json(
            (object)[
                'data' => $tasks,
            ]
        );
    }

    #[Route(path: '/getAllTasks/{userId}', name: 'app_get_all_tasks', methods: ['GET','POST'])]
    public function getAllTasks(Request $request, $userId): Response
    {
        //TODO: Implémenter une fonction qui va permettre de récupérer toutes les tasks de l'utilisateur avec l'ID $userId
        $allTasks = $this->doctrine->getRepository(Tasks::class)->findBy(['userId' => $userId]);
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
