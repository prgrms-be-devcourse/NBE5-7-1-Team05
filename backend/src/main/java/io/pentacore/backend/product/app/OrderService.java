package io.pentacore.backend.product.app;

import io.pentacore.backend.global.unit.exception.CustomException;
import io.pentacore.backend.global.unit.exception.ErrorCode;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import io.pentacore.backend.product.dao.OrderRepository;
import io.pentacore.backend.product.domain.Order;
import io.pentacore.backend.product.dto.OrderResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    @Transactional
    public void deleteOrder(Long orderId) {
        orderRepository.findById(orderId)
                .orElseThrow(() -> new CustomException(ErrorCode.ORDER_NOT_FOUND));

        orderRepository.deleteById(orderId);
    }

    @Transactional(readOnly = true)
    public List<OrderResponseDto> getOrdersByEmail(String email) {
        List<Order> orders = orderRepository.findByEmailWithOrderProducts(email);

        List<OrderResponseDto> orderResponseDtos = new ArrayList<>();
        for (Order order : orders) {
            orderResponseDtos.add(OrderResponseDto.from(order));
        }

        return orderResponseDtos;
    }
}
