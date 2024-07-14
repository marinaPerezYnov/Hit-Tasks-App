<?php
declare(strict_types=1);
namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
// use App\Repository\UserRepository;

/*
    toto@gmail.com
    mdp : root
*/

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 */
// An exception occurred while executing a query: SQLSTATE[42S02]: Base table or view not found: 1146 Table 'api_hit_tasks.user' doesn't exist
#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: 'User')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    private $id;
    /**
     * @ORM\Column(type="text", nullable=true)
     */
    #[ORM\Column(type:"string", length: 180, unique: true)]
    private $email;

    #[ORM\Column(type: "string", length: 255)]
    private $password;

    #[ORM\Column(type: "integer", nullable: true)]
    private $weekValue;

    //clé d'abonnement 0 = compte seul, 1 = compte famille
    #[ORM\Column(type: "integer")]
    private $subscriptionKey;

    //numéro aléatoire de 6 chiffres pour le compte famille qui sera associé à chaque membre de la famille
    #[ORM\Column(type: "integer", nullable: true)]
    private $familyKey;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getWeekValue(): ?int
    {
        return $this->weekValue;
    }

    public function setWeekValue(?int $weekValue): self
    {
        $this->weekValue = $weekValue;

        return $this;
    }

    public function getSubscriptionKey(): ?int
    {
        return $this->subscriptionKey;
    }

    public function setSubscriptionKey(int $subscriptionKey): self
    {
        $this->subscriptionKey = $subscriptionKey;

        return $this;
    }

    public function getFamilyKey(): ?int
    {
        return $this->familyKey;
    }

    public function setFamilyKey(?int $familyKey): self
    {
        $this->familyKey = $familyKey;

        return $this;
    }

    public function getRoles(): array
    {
        return ['ROLE_USER'];
    }

    public function getSalt()
    {
        return null;
    }

    public function eraseCredentials()
    {
        // Suppression des données sensibles de l'utilisateur
    }

    public function getUserIdentifier(): string
    {
        return $this->email;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }
}