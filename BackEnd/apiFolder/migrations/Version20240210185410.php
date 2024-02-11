<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240210185410 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE Historic ADD value_tasks_completed VARCHAR(255) DEFAULT NULL, DROP valueTasksCompleted');
        $this->addSql('ALTER TABLE Tasks CHANGE name name VARCHAR(255) DEFAULT NULL, CHANGE taskValue task_value INT DEFAULT NULL');
        $this->addSql('ALTER TABLE User DROP roles, CHANGE weekValue week_value INT DEFAULT NULL');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_2DA17977E7927C74 ON User (email)');
    }
}
