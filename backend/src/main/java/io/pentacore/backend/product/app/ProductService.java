package io.pentacore.backend.product.app;

import io.pentacore.backend.product.dao.ProductRepository;
import io.pentacore.backend.product.domain.Product;
import io.pentacore.backend.product.dto.UpdateRequest;
import jakarta.transaction.Transactional;
import java.util.NoSuchElementException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public Product updateProductStock(Long productId, UpdateRequest updateRequest) {

        Product updatedProduct = productRepository.findById(productId)
                .orElseThrow(() -> new NoSuchElementException("상품을 찾을 수 없습니다."));

        updatedProduct.changeStock(updateRequest.getStock());

        return updatedProduct;
    }

    public void deleteProduct(Long productId) {
        productRepository.deleteById(productId);

    }

    public List<Product> getAllProduct() {
        return productRepository.findAll();
    }

}
