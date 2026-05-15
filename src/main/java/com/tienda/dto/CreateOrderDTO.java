package com.tienda.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderDTO {
    
    @NotBlank(message = "La dirección de envío es requerida")
    private String shippingAddress;
    
    @NotBlank(message = "La ciudad es requerida")
    private String shippingCity;
    
    @NotBlank(message = "El país es requerido")
    private String shippingCountry;
    
    @NotBlank(message = "El código postal es requerido")
    private String shippingZipCode;
    
    private String notes;
}
