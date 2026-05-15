package com.tienda.service;

import com.tienda.dto.CreateOrderDTO;
import com.tienda.dto.OrderDTO;
import com.tienda.dto.OrderItemDTO;
import com.tienda.entity.Cart;
import com.tienda.entity.CartItem;
import com.tienda.entity.Order;
import com.tienda.entity.OrderItem;
import com.tienda.entity.OrderStatus;
import com.tienda.entity.User;
import com.tienda.repository.CartRepository;
import com.tienda.repository.OrderRepository;
import com.tienda.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductService productService;
    
    // Constantes para cálculos
    private static final BigDecimal TAX_RATE = new BigDecimal("0.08"); // 8% de impuesto
    private static final BigDecimal SHIPPING_COST = new BigDecimal("10.00"); // Costo fijo de envío
    
    public OrderDTO createOrder(String buyerId, CreateOrderDTO createOrderDTO) {
        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new RuntimeException("Comprador no encontrado"));
        
        Cart cart = cartRepository.findByUserId(buyerId)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado o vacío"));
        
        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("El carrito está vacío");
        }
        
        // Crear orden
        Order order = Order.builder()
                .buyerId(buyerId)
                .buyerName(buyer.getFirstName() + " " + buyer.getLastName())
                .buyerEmail(buyer.getEmail())
                .buyerPhone(buyer.getPhone())
                .shippingAddress(createOrderDTO.getShippingAddress())
                .shippingCity(createOrderDTO.getShippingCity())
                .shippingCountry(createOrderDTO.getShippingCountry())
                .shippingZipCode(createOrderDTO.getShippingZipCode())
                .status(OrderStatus.PENDING)
                .notes(createOrderDTO.getNotes())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        // Convertir items del carrito a items de la orden y actualizar stock
        List<OrderItem> orderItems = cart.getItems()
                .stream()
                .map(cartItem -> {
                    // Actualizar stock del producto
                    productService.updateStock(cartItem.getProductId(), cartItem.getQuantity());
                    
                    return OrderItem.builder()
                            .productId(cartItem.getProductId())
                            .productName(cartItem.getProductName())
                            .quantity(cartItem.getQuantity())
                            .unitPrice(cartItem.getPrice())
                            .sellerId(cartItem.getSellerId())
                            .sellerName(cartItem.getSellerName())
                            .build();
                })
                .collect(Collectors.toList());
        
        order.setItems(orderItems);
        
        // Calcular totales
        BigDecimal subtotal = order.getItems()
                .stream()
                .map(OrderItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal tax = subtotal.multiply(TAX_RATE);
        BigDecimal totalAmount = subtotal.add(tax).add(SHIPPING_COST);
        
        order.setSubtotal(subtotal);
        order.setTax(tax);
        order.setShippingCost(SHIPPING_COST);
        order.setTotalAmount(totalAmount);
        
        // Guardar orden
        Order savedOrder = orderRepository.save(order);
        
        // Limpiar carrito
        cartRepository.deleteById(cart.getId());
        
        return convertToDTO(savedOrder);
    }
    
    public OrderDTO getOrder(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));
        return convertToDTO(order);
    }
    
    public List<OrderDTO> getBuyerOrders(String buyerId) {
        return orderRepository.findByBuyerIdOrderByCreatedAtDesc(buyerId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<OrderDTO> getSellerOrders(String sellerId) {
        return orderRepository.findByItems_SellerIdOrderByCreatedAtDesc(sellerId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public OrderDTO updateOrderStatus(String orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));
        
        order.setStatus(newStatus);
        order.setUpdatedAt(LocalDateTime.now());
        
        // Registrar fechas importantes
        if (newStatus == OrderStatus.SHIPPED) {
            order.setShippedAt(LocalDateTime.now());
        } else if (newStatus == OrderStatus.DELIVERED) {
            order.setDeliveredAt(LocalDateTime.now());
        }
        
        Order updatedOrder = orderRepository.save(order);
        return convertToDTO(updatedOrder);
    }
    
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<OrderDTO> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    private OrderDTO convertToDTO(Order order) {
        return OrderDTO.builder()
                .id(order.getId())
                .buyerId(order.getBuyerId())
                .buyerName(order.getBuyerName())
                .buyerEmail(order.getBuyerEmail())
                .buyerPhone(order.getBuyerPhone())
                .shippingAddress(order.getShippingAddress())
                .shippingCity(order.getShippingCity())
                .shippingCountry(order.getShippingCountry())
                .shippingZipCode(order.getShippingZipCode())
                .items(order.getItems()
                        .stream()
                        .map(item -> OrderItemDTO.builder()
                                .productId(item.getProductId())
                                .productName(item.getProductName())
                                .quantity(item.getQuantity())
                                .unitPrice(item.getUnitPrice())
                                .sellerId(item.getSellerId())
                                .sellerName(item.getSellerName())
                                .totalPrice(item.getTotalPrice())
                                .build())
                        .collect(Collectors.toList()))
                .subtotal(order.getSubtotal())
                .tax(order.getTax())
                .shippingCost(order.getShippingCost())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .notes(order.getNotes())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .shippedAt(order.getShippedAt())
                .deliveredAt(order.getDeliveredAt())
                .build();
    }
}
