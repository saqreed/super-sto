package ru.supersto.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import ru.supersto.entity.Product;
import ru.supersto.entity.ProductCategory;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {

    Optional<Product> findByPartNumber(String partNumber);

    List<Product> findByCategory(ProductCategory category);

    List<Product> findByBrand(String brand);

    @Query("{'isActive': true}")
    List<Product> findAllActive();

    @Query("{'isActive': true, 'category': ?0}")
    List<Product> findActiveByCategory(ProductCategory category);

    @Query("{'$text': {'$search': ?0}, 'isActive': true}")
    List<Product> searchByNameAndDescription(String searchTerm);

    @Query("{'isActive': true, 'quantity': {'$gt': 0}}")
    List<Product> findInStock();

    @Query("{'isActive': true, 'quantity': {'$lte': ?0}}")
    List<Product> findLowStock(int threshold);
}