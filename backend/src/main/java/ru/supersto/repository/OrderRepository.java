package ru.supersto.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import ru.supersto.entity.Order;
import ru.supersto.entity.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {

    List<Order> findByClientId(String clientId);

    List<Order> findByStatus(OrderStatus status);

    @Query("{'createdAt': {'$gte': ?0, '$lte': ?1}}")
    List<Order> findByDateRange(LocalDateTime startDate, LocalDateTime endDate);

    @Query("{'clientId': ?0, 'status': ?1}")
    List<Order> findByClientAndStatus(String clientId, OrderStatus status);

    @Query("{'status': {'$in': ?0}}")
    List<Order> findByStatusIn(List<OrderStatus> statuses);

    @Query("{'clientId': ?0, 'createdAt': {'$gte': ?1, '$lte': ?2}}")
    List<Order> findByClientAndDateRange(String clientId, LocalDateTime startDate, LocalDateTime endDate);
}