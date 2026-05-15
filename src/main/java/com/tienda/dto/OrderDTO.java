package com.tienda.dto;

import com.tienda.entity.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {
    
    private String id;
    private String buyerId;
    private String buyerName;
    private String buyerEmail;
    private String buyerPhone;
    
    private String shippingAddress;
    private String shippingCity;
    private String shippingCountry;
    private String shippingZipCode;
    
    private List<OrderItemDTO> items;
    
    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal shippingCost;
    private BigDecimal totalAmount;
    
    private OrderStatus status;
    private String notes;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime shippedAt;
    private LocalDateTime deliveredAt;
}
