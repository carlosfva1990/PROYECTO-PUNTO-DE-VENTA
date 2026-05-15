package com.tienda.dto;

import com.tienda.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponseDTO {
    private String token;
    private String userId;
    private String email;
    private String firstName;
    private String lastName;
    private UserRole role;
}
