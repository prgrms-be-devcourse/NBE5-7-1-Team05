package io.pentacore.backend.product.service;

import io.pentacore.backend.product.dao.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public void deleteProduct(Long productId) {
        productRepository.deleteById(productId);
    }
}
