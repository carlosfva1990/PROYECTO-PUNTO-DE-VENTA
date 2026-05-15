package com.tienda.controller;

import com.tienda.dto.CreateProductDTO;
import com.tienda.dto.OrderDTO;
import com.tienda.dto.ProductDTO;
import com.tienda.security.CustomUserDetails;
import com.tienda.service.OrderService;
import com.tienda.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/seller")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class SellerController {
    
    private final ProductService productService;
    private final OrderService orderService;
    
    @PostMapping("/products")
    public ResponseEntity<ProductDTO> createProduct(
            @Valid @RequestBody CreateProductDTO createProductDTO,
            Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        ProductDTO product = productService.createProduct(userDetails.getUserId(), createProductDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }
    
    @GetMapping("/products")
    public ResponseEntity<List<ProductDTO>> getMyProducts(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        List<ProductDTO> products = productService.getSellerProducts(userDetails.getUserId());
        return ResponseEntity.ok(products);
    }
    
    @PutMapping("/products/{productId}")
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable String productId,
            @Valid @RequestBody CreateProductDTO updateDTO,
            Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        ProductDTO product = productService.updateProduct(productId, userDetails.getUserId(), updateDTO);
        return ResponseEntity.ok(product);
    }
    
    @DeleteMapping("/products/{productId}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable String productId,
            Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        productService.deleteProduct(productId, userDetails.getUserId());
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/orders")
    public ResponseEntity<List<OrderDTO>> getMyOrders(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        List<OrderDTO> orders = orderService.getSellerOrders(userDetails.getUserId());
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/orders/{orderId}")
    public ResponseEntity<OrderDTO> getOrder(@PathVariable String orderId) {
        OrderDTO order = orderService.getOrder(orderId);
        return ResponseEntity.ok(order);
    }
}
