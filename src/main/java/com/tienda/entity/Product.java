package com.tienda.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    
    @Id
    private String id;
    
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private String category;
    private List<String> images;
    
    // Información del vendedor
    private String sellerId;
    private String sellerName;
    
    private Integer rating;
    private Integer reviews;
    
    private boolean active;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
