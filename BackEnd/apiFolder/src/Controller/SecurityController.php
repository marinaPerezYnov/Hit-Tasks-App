<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class SecurityController extends AbstractController
{

    #[Route('/login', name: 'login', methods: ['POST'])]
    public function login(Request $request, UserPasswordEncoderInterface $passwordEncoder): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $user = new User();
        $user->setEmail($data['email']);

        $encodedPassword = $passwordEncoder->encodePassword($user, $data['password']);
        $user->setPassword($encodedPassword);

        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse(['success' => true]);
    }

    // #[Route('/logout', name: 'app_logout', methods: ['GET'])]
    // public function logout()
    // {
    //     // controller can be blank: it will never be called!
    //     throw new \Exception('Don\'t forget to activate logout in security.yaml');
    // }
}

    // public const LOGIN_ROUTE = 'app_login';

    // #[Route(path: '/login', name: self::LOGIN_ROUTE, methods: ['POST'])]