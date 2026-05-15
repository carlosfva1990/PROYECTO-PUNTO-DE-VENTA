package com.tienda.service;

import com.tienda.dto.CreateProductDTO;
import com.tienda.dto.ProductDTO;
import com.tienda.entity.Product;
import com.tienda.entity.User;
import com.tienda.repository.ProductRepository;
import com.tienda.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    
    public ProductDTO createProduct(String sellerId, CreateProductDTO createProductDTO) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Vendedor no encontrado"));
        
        Product product = Product.builder()
                .name(createProductDTO.getName())
                .description(createProductDTO.getDescription())
                .price(createProductDTO.getPrice())
                .stock(createProductDTO.getStock())
                .category(createProductDTO.getCategory())
                .images(createProductDTO.getImages())
                .sellerId(sellerId)
                .sellerName(seller.getStoreName())
                .active(true)
                .rating(0)
                .reviews(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
    }
    
    public ProductDTO updateProduct(String productId, String sellerId, CreateProductDTO updateDTO) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        
        if (!product.getSellerId().equals(sellerId)) {
            throw new RuntimeException("No tienes permiso para actualizar este producto");
        }
        
        product.setName(updateDTO.getName());
        product.setDescription(updateDTO.getDescription());
        product.setPrice(updateDTO.getPrice());
        product.setStock(updateDTO.getStock());
        product.setCategory(updateDTO.getCategory());
        product.setImages(updateDTO.getImages());
        product.setUpdatedAt(LocalDateTime.now());
        
        Product updatedProduct = productRepository.save(product);
        return convertToDTO(updatedProduct);
    }
    
    public void deleteProduct(String productId, String sellerId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        
        if (!product.getSellerId().equals(sellerId)) {
            throw new RuntimeException("No tienes permiso para eliminar este producto");
        }
        
        productRepository.deleteById(productId);
    }
    
    public ProductDTO getProduct(String productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        return convertToDTO(product);
    }
    
    public List<ProductDTO> getAllProducts() {
        return productRepository.findByActiveTrue()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ProductDTO> getSellerProducts(String sellerId) {
        return productRepository.findBySellerIdAndActiveTrue(sellerId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ProductDTO> searchProducts(String keyword) {
        List<Product> byName = productRepository.searchByName(keyword);
        List<Product> byDescription = productRepository.searchByDescription(keyword);
        
        return byName.stream()
                .filter(Product::isActive)
                .collect(Collectors.toList())
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ProductDTO> getProductsByCategory(String category) {
        return productRepository.findByCategory(category)
                .stream()
                .filter(Product::isActive)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public Product updateStock(String productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        
        if (product.getStock() < quantity) {
            throw new RuntimeException("Stock insuficiente");
        }
        
        product.setStock(product.getStock() - quantity);
        return productRepository.save(product);
    }
    
    private ProductDTO convertToDTO(Product product) {
        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .category(product.getCategory())
                .images(product.getImages())
                .sellerId(product.getSellerId())
                .sellerName(product.getSellerName())
                .rating(product.getRating())
                .reviews(product.getReviews())
                .active(product.isActive())
                .build();
    }
}
