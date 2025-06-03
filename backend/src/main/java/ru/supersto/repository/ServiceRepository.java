package ru.supersto.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import ru.supersto.entity.Service;
import ru.supersto.entity.ServiceCategory;

import java.util.List;

@Repository
public interface ServiceRepository extends MongoRepository<Service, String> {

    List<Service> findByCategory(ServiceCategory category);

    @Query("{'isActive': true}")
    List<Service> findAllActive();

    @Query("{'isActive': true, 'category': ?0}")
    List<Service> findActiveByCategoryCategory(ServiceCategory category);

    @Query("{'$text': {'$search': ?0}, 'isActive': true}")
    List<Service> searchByNameAndDescription(String searchTerm);

    @Query("{'isActive': true, 'price': {'$lte': ?0}}")
    List<Service> findActiveByMaxPrice(double maxPrice);
}