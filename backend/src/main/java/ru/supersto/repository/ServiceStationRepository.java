package ru.supersto.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import ru.supersto.entity.ServiceStation;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceStationRepository extends MongoRepository<ServiceStation, String> {

    Optional<ServiceStation> findByName(String name);

    List<ServiceStation> findByAddressContainingIgnoreCase(String address);

    @Query("{ 'phone' : ?0 }")
    Optional<ServiceStation> findByPhone(String phone);

    @Query("{ 'email' : ?0 }")
    Optional<ServiceStation> findByEmail(String email);
}