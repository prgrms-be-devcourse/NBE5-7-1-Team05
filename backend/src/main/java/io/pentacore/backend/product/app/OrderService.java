package io.pentacore.backend.product.app;

import io.pentacore.backend.product.dao.OrderProductRepository;
import io.pentacore.backend.product.dao.OrderRepository;
import java.util.NoSuchElementException;
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
                        .orElseThrow(() -> new NoSuchElementException("주문이 존재하지 않습니다."));

        orderRepository.deleteById(orderId);
    }
}
