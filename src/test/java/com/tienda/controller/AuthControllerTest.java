package com.tienda.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tienda.dto.LoginRequestDTO;
import com.tienda.dto.LoginResponseDTO;
import com.tienda.dto.UserRegistrationDTO;
import com.tienda.entity.UserRole;
import com.tienda.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
public class AuthControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private AuthService authService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Test
    public void testRegister() throws Exception {
        // Arrange
        UserRegistrationDTO registrationDTO = UserRegistrationDTO.builder()
                .email("test@example.com")
                .password("password123")
                .firstName("Test")
                .lastName("User")
                .phone("+34123456789")
                .address("Calle Test 1")
                .city("Madrid")
                .country("España")
                .zipCode("28001")
                .role(UserRole.BUYER)
                .build();
        
        LoginResponseDTO responseDTO = LoginResponseDTO.builder()
                .token("jwt-token-here")
                .userId("user-123")
                .email("test@example.com")
                .firstName("Test")
                .lastName("User")
                .role(UserRole.BUYER)
                .build();
        
        when(authService.register(any(UserRegistrationDTO.class))).thenReturn(responseDTO);
        
        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.userId").value("user-123"))
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.role").value("BUYER"));
        
        verify(authService, times(1)).register(any(UserRegistrationDTO.class));
    }
    
    @Test
    public void testLogin() throws Exception {
        // Arrange
        LoginRequestDTO loginRequest = LoginRequestDTO.builder()
                .email("test@example.com")
                .password("password123")
                .build();
        
        LoginResponseDTO responseDTO = LoginResponseDTO.builder()
                .token("jwt-token-here")
                .userId("user-123")
                .email("test@example.com")
                .firstName("Test")
                .lastName("User")
                .role(UserRole.BUYER)
                .build();
        
        when(authService.login(any(LoginRequestDTO.class))).thenReturn(responseDTO);
        
        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.userId").value("user-123"))
                .andExpect(jsonPath("$.email").value("test@example.com"));
        
        verify(authService, times(1)).login(any(LoginRequestDTO.class));
    }
}
