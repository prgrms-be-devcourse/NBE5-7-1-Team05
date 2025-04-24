package io.pentacore.backend.product.app;

import io.pentacore.backend.product.dao.ProductRepository;
import io.pentacore.backend.product.domain.Product;
import io.pentacore.backend.product.dto.UpdateRequest;

import java.util.List;
import java.util.NoSuchElementException;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import io.pentacore.backend.admin.dao.AdminRepository;
import io.pentacore.backend.admin.domain.Admin;
import io.pentacore.backend.product.dto.ProductRequestDto;
import io.pentacore.backend.product.dto.ProductResponseDto;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final AdminRepository adminRepository;

    @Transactional
    public ProductResponseDto addProduct(Long adminId, ProductRequestDto req) {
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("관리자를 찾을 수 없습니다."));

        Product product = Product.builder()
                .admin(admin)
                .name(req.getName())
                .category(req.getCategory())
                .price(req.getPrice())
                .imageUrl(req.getImageUrl())
                .stock(req.getStock())
                .build();

        Product savedProduct = productRepository.save(product);

        return new ProductResponseDto(savedProduct);
    }

    @Transactional
    public Product updateProductStock(Long productId, UpdateRequest updateRequest) {

        Product updatedProduct = productRepository.findById(productId)
                .orElseThrow(() -> new NoSuchElementException("상품을 찾을 수 없습니다."));

        updatedProduct.changeStock(updateRequest.getStock());

        return updatedProduct;
    }

    @Transactional
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NoSuchElementException("상품을 찾을 수 없습니다."));

        product.softDelete(); // isDeleted = true로 변경
    }

    @Transactional(readOnly = true)
    public List<Product> getAllProduct() {
        return productRepository.findAll();
    }

}

