package com.tienda.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemDTO {
    private String productId;
    private String productName;
    private Integer quantity;
    private BigDecimal price;
    private String sellerId;
    private String sellerName;
    private BigDecimal totalPrice;
}
