package io.pentacore.backend.product.service;

import io.pentacore.backend.product.dao.ProductRepository;
import io.pentacore.backend.product.domain.Product;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public void deleteProduct(Long productId) {
        productRepository.deleteById(productId);

    }

    public List<Product> getAllProduct() {
        return productRepository.findAll();
    }

}
