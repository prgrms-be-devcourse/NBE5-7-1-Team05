package io.pentacore.backend.product.app;

import io.pentacore.backend.product.dao.OrderProductRepository;
import io.pentacore.backend.product.dao.OrderRepository;
import io.pentacore.backend.product.dao.ProductRepository;
import io.pentacore.backend.product.domain.Order;
import io.pentacore.backend.product.domain.OrderProduct;
import io.pentacore.backend.product.domain.Product;
import io.pentacore.backend.product.dto.PaymentRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Transactional
    public void addOrder(PaymentRequestDto request) {
        Order order = Order.from(request);
        List<OrderProduct> orderProducts = order.getOrderProducts();

        request.getProducts().forEach(product -> {

            Product findProduct = productRepository.findById(product.getProductId())
                    .orElseThrow(() -> new NoSuchElementException(
                            product.getProductId() + "번 상품은 존재하지 않습니다."
                    ));

            findProduct.order(product.getQuantity());

            orderProducts.add(OrderProduct.builder()
                    .order(order)
                    .product(findProduct)
                    .quantity(product.getQuantity())
                    .build()
            );
        });

        orderRepository.save(order);
    }
}
