<?php

namespace App\Repository;

use App\Entity\ListMembers;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;

/**
 * @extends ServiceEntityRepository<ListMembers>
 *
 * @method ListMembers|null find($id, $lockMode = null, $lockVersion = null)
 * @method ListMembers|null findOneBy(array $criteria, array $orderBy = null)
 * @method ListMembers[]    findAll()
 * @method ListMembers[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ListMembersRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ListMembers::class);
    }

    public function save(ListMembers $listMembers, bool $flush = false): void
    {
        $this->getEntityManager()->persist($listMembers);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(ListMembers $listMembers, bool $flush = false): void
    {
        $this->getEntityManager()->remove($listMembers);

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