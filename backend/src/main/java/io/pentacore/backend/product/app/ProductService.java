package io.pentacore.backend.product.app;

import io.pentacore.backend.global.unit.exception.CustomException;
import io.pentacore.backend.global.unit.exception.ErrorCode;
import io.pentacore.backend.product.dao.ProductRepository;
import io.pentacore.backend.product.domain.Product;
import io.pentacore.backend.product.dto.UpdateRequest;

import java.time.LocalDateTime;
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
                .orElseThrow(() -> new CustomException(ErrorCode.ADMIN_NOT_FOUND));

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
                .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_FOUND));

        updatedProduct.changeStock(updateRequest.getStock());

        return updatedProduct;
    }

    @Transactional
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_FOUND));

        product.softDelete(); // isDeleted = true로 변경
    }

    @Transactional
    public void deleteExpiredProducts() {
        LocalDateTime expiredDate = LocalDateTime.now().minusDays(30);
        //LocalDateTime expiredDate = LocalDateTime.now().minusMinutes(1); //테스트용
        productRepository.deleteOldSoftDeletedRecords(expiredDate); // 여기서 expiredDate 넘김
    }

    @Transactional(readOnly = true)
    public List<Product> getAllProduct() {
        return productRepository.findAll();
    }

}

