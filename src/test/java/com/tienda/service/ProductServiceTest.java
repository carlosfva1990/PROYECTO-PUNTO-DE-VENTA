package com.tienda.service;

import com.tienda.dto.CreateProductDTO;
import com.tienda.dto.ProductDTO;
import com.tienda.entity.Product;
import com.tienda.entity.User;
import com.tienda.entity.UserRole;
import com.tienda.repository.ProductRepository;
import com.tienda.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {
    
    @Mock
    private ProductRepository productRepository;
    
    @Mock
    private UserRepository userRepository;
    
    @InjectMocks
    private ProductService productService;
    
    private String sellerId = "seller-123";
    private User seller;
    private CreateProductDTO createProductDTO;
    
    @BeforeEach
    public void setUp() {
        seller = User.builder()
                .id(sellerId)
                .email("seller@example.com")
                .firstName("John")
                .lastName("Seller")
                .role(UserRole.SELLER)
                .storeName("Mi Tienda")
                .build();
        
        createProductDTO = CreateProductDTO.builder()
                .name("Laptop")
                .description("Laptop de 15 pulgadas")
                .price(new BigDecimal("999.99"))
                .stock(10)
                .category("Electrónica")
                .build();
    }
    
    @Test
    public void testCreateProduct() {
        // Arrange
        when(userRepository.findById(sellerId)).thenReturn(Optional.of(seller));
        
        Product savedProduct = Product.builder()
                .id("product-123")
                .name(createProductDTO.getName())
                .description(createProductDTO.getDescription())
                .price(createProductDTO.getPrice())
                .stock(createProductDTO.getStock())
                .category(createProductDTO.getCategory())
                .sellerId(sellerId)
                .sellerName(seller.getStoreName())
                .active(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        when(productRepository.save(any(Product.class))).thenReturn(savedProduct);
        
        // Act
        ProductDTO result = productService.createProduct(sellerId, createProductDTO);
        
        // Assert
        assertNotNull(result);
        assertEquals("Laptop", result.getName());
        assertEquals(sellerId, result.getSellerId());
        assertTrue(result.isActive());
        
        verify(userRepository, times(1)).findById(sellerId);
        verify(productRepository, times(1)).save(any(Product.class));
    }
    
    @Test
    public void testGetProduct() {
        // Arrange
        String productId = "product-123";
        Product product = Product.builder()
                .id(productId)
                .name("Laptop")
                .description("Laptop de 15 pulgadas")
                .price(new BigDecimal("999.99"))
                .stock(10)
                .category("Electrónica")
                .sellerId(sellerId)
                .sellerName("Mi Tienda")
                .active(true)
                .build();
        
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));
        
        // Act
        ProductDTO result = productService.getProduct(productId);
        
        // Assert
        assertNotNull(result);
        assertEquals("Laptop", result.getName());
        assertEquals(new BigDecimal("999.99"), result.getPrice());
        
        verify(productRepository, times(1)).findById(productId);
    }
    
    @Test
    public void testGetProductNotFound() {
        // Arrange
        String productId = "non-existent";
        when(productRepository.findById(productId)).thenReturn(Optional.empty());
        
        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            productService.getProduct(productId);
        });
        
        verify(productRepository, times(1)).findById(productId);
    }
}
