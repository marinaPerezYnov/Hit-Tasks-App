<?php

namespace App\Service;

// Dépendances requises
use App\Entity\User;
use Symfony\Component\Mailer\MailerInterface;

// https://symfony.com/doc/current/mailer.html#installation
use Symfony\Component\Mime\Email;

/**
 * Service pour le parrainage d'utilisateurs.
 
    * Cette classe envoie des notifications par e-mail aux utilisateurs parrains lorsqu'ils parrainent de nouveaux utilisateurs.
    * La classe ParrainageService dépend de l'interface MailerInterface de Symfony pour envoyer des e-mails.
 */
class ParrainageService
{
    private $mailer;

    /**
     * Constructeur de la classe.
     * @param MailerInterface $mailer
     * Permet d' injecter une instance de MailerInterface dans le constructeur de la classe.
     */
    public function __construct(MailerInterface $mailer)
    {
        $this->mailer = $mailer;
    }

    /**
     * Envoie une notification par e-mail à un utilisateur parrain lorsqu'il parraine un nouvel utilisateur.
     * Permet d'envoyer une notification par e-mail à un utilisateur parrain lorsqu'il parraine un nouvel utilisateur.
     */
    public function envoyerNotificationParrainage(string $emailParrain, string $emailParraine, string $family_Key)
    {
        /* Crée une nouvelle instance d'objet Email. */
        $email = (new Email())
            ->from('akilaroha@hotmail.fr')
            ->to($emailParraine)
            ->subject('Nouveau parrainé !')
            ->priority(Email::PRIORITY_HIGH)
            ->subject('Important Notification')
            ->html(
                "<div style='margin: 0; padding: 0; background-color: #ffffff;'>
                    <table style='width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;'>
                        <tr>
                            <td style='padding: 20px; text-align: center;'>
                                <h2>Titre de votre email</h2>
                            </td>
                        </tr>
                        <tr>
                            <td style='padding: 20px;'>
                                <p>Bonjour,</p>

                                <p>Ce message contient un lien important pour vous. Veuillez cliquer sur le bouton ci-dessous pour accéder au site web :</p>

                                <a href='http:/localhost:3030?family_key=${family_Key}' target='_blank' style='background-color: #007bff; color: #ffffff; padding: 10px 20px; text-decoration: none; display: inline-block;'>Cliquez ici pour visiter le site</a>

                                <p>Cordialement,</p>

                                <p>L'équipe de [Hit_Tasks]</p>
                            </td>
                        </tr>
                        <tr>
                            <td style='padding: 20px; text-align: center;'>
                                <p>&copy; [Hit_Tasks]</p>
                            </td>
                        </tr>
                    </table>
                </div>"
                );

        $this->mailer->send($email);
    }
    
}
