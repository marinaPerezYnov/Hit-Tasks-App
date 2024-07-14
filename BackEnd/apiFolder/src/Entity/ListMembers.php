<?php
declare(strict_types=1);
namespace App\Entity;

use App\Repository\ListMembersRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 */
// An exception occurred while executing a query: SQLSTATE[42S02]: Base table or view not found: 1146 Table 'api_hit_tasks.user' doesn't exist
#[ORM\Entity(repositoryClass: ListMembersRepository::class)]
#[ORM\Table(name: 'ListMembers')]
class ListMembers
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

   //userId
   #[ORM\Column(type: 'integer', nullable: true)]
   private $userId;

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

    public function getUserId(): ?int
    {
        return $this->userId;
    }

    public function setUserId(?int $userId): self
    {
        $this->userId = $userId;

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
}