package com.tienda.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import java.util.Collection;

public class CustomAuthentication implements Authentication {
    
    private final CustomUserDetails userDetails;
    private final String token;
    private boolean authenticated = true;
    
    public CustomAuthentication(CustomUserDetails userDetails, String token) {
        this.userDetails = userDetails;
        this.token = token;
    }
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return userDetails.getAuthorities();
    }
    
    @Override
    public Object getCredentials() {
        return token;
    }
    
    @Override
    public Object getDetails() {
        return userDetails;
    }
    
    @Override
    public Object getPrincipal() {
        return userDetails;
    }
    
    @Override
    public boolean isAuthenticated() {
        return authenticated;
    }
    
    @Override
    public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
        this.authenticated = isAuthenticated;
    }
    
    @Override
    public String getName() {
        return userDetails.getUsername();
    }
}
