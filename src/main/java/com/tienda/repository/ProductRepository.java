package com.tienda.repository;

import com.tienda.entity.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    
    List<Product> findBySellerId(String sellerId);
    List<Product> findByCategory(String category);
    
    @Query("{'name': {$regex: ?0, $options: 'i'}}")
    List<Product> searchByName(String name);
    
    @Query("{'description': {$regex: ?0, $options: 'i'}}")
    List<Product> searchByDescription(String description);
    
    List<Product> findByActiveTrue();
    List<Product> findBySellerIdAndActiveTrue(String sellerId);
}
