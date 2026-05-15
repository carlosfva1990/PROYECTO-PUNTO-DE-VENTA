package com.tienda.service;

import com.tienda.dto.AddToCartDTO;
import com.tienda.dto.CartDTO;
import com.tienda.dto.CartItemDTO;
import com.tienda.entity.Cart;
import com.tienda.entity.CartItem;
import com.tienda.entity.Product;
import com.tienda.repository.CartRepository;
import com.tienda.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {
    
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    
    public CartDTO addToCart(String userId, AddToCartDTO addToCartDTO) {
        Product product = productRepository.findById(addToCartDTO.getProductId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        
        if (product.getStock() < addToCartDTO.getQuantity()) {
            throw new RuntimeException("Stock insuficiente");
        }
        
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> createNewCart(userId));
        
        // Verificar si el producto ya está en el carrito
        Optional<CartItem> existingItem = cart.getItems()
                .stream()
                .filter(item -> item.getProductId().equals(addToCartDTO.getProductId()))
                .findFirst();
        
        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + addToCartDTO.getQuantity());
        } else {
            CartItem newItem = CartItem.builder()
                    .productId(product.getId())
                    .productName(product.getName())
                    .quantity(addToCartDTO.getQuantity())
                    .price(product.getPrice())
                    .sellerId(product.getSellerId())
                    .sellerName(product.getSellerName())
                    .build();
            cart.getItems().add(newItem);
        }
        
        cart.setUpdatedAt(LocalDateTime.now());
        Cart savedCart = cartRepository.save(cart);
        return convertToDTO(savedCart);
    }
    
    public CartDTO getCart(String userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> createNewCart(userId));
        return convertToDTO(cart);
    }
    
    public CartDTO removeFromCart(String userId, String productId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado"));
        
        cart.setItems(cart.getItems()
                .stream()
                .filter(item -> !item.getProductId().equals(productId))
                .collect(Collectors.toList()));
        
        cart.setUpdatedAt(LocalDateTime.now());
        Cart updatedCart = cartRepository.save(cart);
        return convertToDTO(updatedCart);
    }
    
    public CartDTO updateCartItemQuantity(String userId, String productId, Integer quantity) {
        if (quantity <= 0) {
            return removeFromCart(userId, productId);
        }
        
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado"));
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        
        if (product.getStock() < quantity) {
            throw new RuntimeException("Stock insuficiente");
        }
        
        cart.getItems()
                .stream()
                .filter(item -> item.getProductId().equals(productId))
                .findFirst()
                .ifPresent(item -> item.setQuantity(quantity));
        
        cart.setUpdatedAt(LocalDateTime.now());
        Cart updatedCart = cartRepository.save(cart);
        return convertToDTO(updatedCart);
    }
    
    public CartDTO clearCart(String userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado"));
        
        cart.setItems(new ArrayList<>());
        cart.setUpdatedAt(LocalDateTime.now());
        Cart updatedCart = cartRepository.save(cart);
        return convertToDTO(updatedCart);
    }
    
    private Cart createNewCart(String userId) {
        Cart newCart = Cart.builder()
                .userId(userId)
                .items(new ArrayList<>())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        return cartRepository.save(newCart);
    }
    
    private CartDTO convertToDTO(Cart cart) {
        return CartDTO.builder()
                .id(cart.getId())
                .userId(cart.getUserId())
                .items(cart.getItems()
                        .stream()
                        .map(item -> CartItemDTO.builder()
                                .productId(item.getProductId())
                                .productName(item.getProductName())
                                .quantity(item.getQuantity())
                                .price(item.getPrice())
                                .sellerId(item.getSellerId())
                                .sellerName(item.getSellerName())
                                .totalPrice(item.getTotalPrice())
                                .build())
                        .collect(Collectors.toList()))
                .totalItems(cart.getTotalItems())
                .totalPrice(cart.getTotalPrice())
                .build();
    }
}
