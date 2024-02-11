<?php

namespace App\Entity;

use App\Repository\TasksRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\TasksRepository")
 */
#[ORM\Entity(repositoryClass: TasksRepository::class)]
#[ORM\Table(name: 'Tasks')]
class Tasks
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(type: 'integer', nullable: true)]
    private $userId;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $name;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    #[ORM\Column(type: 'integer', nullable: true)]
    private $taskValue;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getTaskValue(): ?int
    {
        return $this->taskValue;
    }

    public function setTaskValue(?int $taskValue): self
    {
        $this->taskValue = $taskValue;

        return $this;
    }
}