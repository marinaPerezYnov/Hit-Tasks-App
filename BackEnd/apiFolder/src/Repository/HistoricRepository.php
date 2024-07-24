<?php

namespace App\Repository;

use App\Entity\Historic;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;

/**
 * @extends ServiceEntityRepository<Historic>
 *
 * @method Historic|null find($id, $lockMode = null, $lockVersion = null)
 * @method Historic|null findOneBy(array $criteria, array $orderBy = null)
 * @method Historic[]    findAll()
 * @method Historic[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class HistoricRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Historic::class);
    }

    public function save(Historic $historic, bool $flush = false): void
    {
        $this->getEntityManager()->persist($historic);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Historic $historic, bool $flush = false): void
    {
        $this->getEntityManager()->remove($historic);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

//    /**
//     * @return User[] Returns an array of User objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('u')
//            ->andWhere('u.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('u.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?User
//    {
//        return $this->createQueryBuilder('u')
//            ->andWhere('u.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}