package io.pentacore.backend.product.api;

import io.pentacore.backend.global.unit.BaseResponse;
import io.pentacore.backend.product.domain.Product;
import io.pentacore.backend.product.dto.ProductRequestDto;
import io.pentacore.backend.product.dto.ProductResponseDto;
import io.pentacore.backend.product.dto.UpdateRequest;
import io.pentacore.backend.product.app.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/products")
public class AdminProductController {
    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ProductResponseDto> addProduct(
            @Valid
            @RequestBody
            ProductRequestDto req
    ) {
        Long adminId = 1L;
        ProductResponseDto res = productService.addProduct(adminId, req);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(res);
    }

    @PutMapping("/{productId}")
    public BaseResponse<Product> updateProductStock(@PathVariable Long productId, @RequestBody UpdateRequest updateRequest) {

        Product updatedProduct = productService.updateProductStock(productId, updateRequest);

        return BaseResponse.ok(updatedProduct);

    }

    @ResponseStatus(HttpStatus.OK)
    @DeleteMapping("/{product_id}")
    public BaseResponse<?> deleteProduct(@PathVariable("product_id") Long productId) {

        productService.deleteProduct(productId);

        return BaseResponse.ok();
    }
}
