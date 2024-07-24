<?php

namespace App\Entity;

use App\Repository\HistoricRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\HistoricRepository")
 */
#[ORM\Entity(repositoryClass: HistoricRepository::class)]
#[ORM\Table(name: 'Historic')]
class Historic
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(type: 'integer', nullable: true)]
    private $userId;

    #[ORM\Column(type: 'integer', nullable: true)]
    private $taskId;
    /**
     * @ORM\Column(type="text", nullable=true)
     */
    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $valueTasksCompleted;

    #[ORM\Column(type:"datetime", nullable: true)]
    private $date;

    public function getId(): ?int
    {
        return $this->id;
    }
    public function setTaskId(?int $taskId): self
    {
        $this->taskId = $taskId;

        return $this;
    }
    
    public function getTaskId(): ?int
    {
        return $this->taskId;
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

    public function getValueTasksCompleted(): ?string
    {
        return $this->valueTasksCompleted;
    }

    public function setValueTasksCompleted(?string $valueTasksCompleted): self
    {
        $this->valueTasksCompleted = $valueTasksCompleted;

        return $this;
    }

    public function getDate(): ?\DateTime
    {
        return $this->date;
    }

    public function setDate(?\DateTime $date): self
    {
        $this->date = $date;

        return $this;
    }
}