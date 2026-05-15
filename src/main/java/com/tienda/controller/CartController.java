package com.tienda.controller;

import com.tienda.dto.AddToCartDTO;
import com.tienda.dto.CartDTO;
import com.tienda.security.CustomUserDetails;
import com.tienda.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class CartController {
    
    private final CartService cartService;
    
    @GetMapping
    public ResponseEntity<CartDTO> getCart(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        CartDTO cart = cartService.getCart(userDetails.getUserId());
        return ResponseEntity.ok(cart);
    }
    
    @PostMapping("/add")
    public ResponseEntity<CartDTO> addToCart(
            @Valid @RequestBody AddToCartDTO addToCartDTO,
            Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        CartDTO cart = cartService.addToCart(userDetails.getUserId(), addToCartDTO);
        return ResponseEntity.ok(cart);
    }
    
    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<CartDTO> removeFromCart(
            @PathVariable String productId,
            Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        CartDTO cart = cartService.removeFromCart(userDetails.getUserId(), productId);
        return ResponseEntity.ok(cart);
    }
    
    @PutMapping("/update/{productId}")
    public ResponseEntity<CartDTO> updateItemQuantity(
            @PathVariable String productId,
            @RequestParam Integer quantity,
            Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        CartDTO cart = cartService.updateCartItemQuantity(userDetails.getUserId(), productId, quantity);
        return ResponseEntity.ok(cart);
    }
    
    @DeleteMapping("/clear")
    public ResponseEntity<CartDTO> clearCart(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        CartDTO cart = cartService.clearCart(userDetails.getUserId());
        return ResponseEntity.ok(cart);
    }
}
