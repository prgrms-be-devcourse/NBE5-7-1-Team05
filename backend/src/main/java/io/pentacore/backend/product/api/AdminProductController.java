package io.pentacore.backend.product.api;

import io.pentacore.backend.admin.app.AdminContextService;
import io.pentacore.backend.global.unit.BaseResponse;
import io.pentacore.backend.global.unit.response.SuccessCode;
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

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/products")
public class AdminProductController {
    private final ProductService productService;
    private final AdminContextService adminContextService;

    @PostMapping        //상품 추가
    public ResponseEntity<BaseResponse<ProductResponseDto>> addProduct(@Valid @RequestBody ProductRequestDto req) {

        ProductResponseDto res = productService.addProduct(adminContextService.getCurrentAdminId(),req);

        return BaseResponse.ok(SuccessCode.ADDED_SUCCESS.getMessage(), res,  SuccessCode.ADDED_SUCCESS.getStatus());
    }

    @PutMapping("/{productId}")
    public ResponseEntity<BaseResponse<Product>> updateProductStock(@PathVariable Long productId, @Valid @RequestBody UpdateRequest updateRequest) {

        Product updatedProduct = productService.updateProductStock(productId, updateRequest);

        return BaseResponse.ok(SuccessCode.MODIFIED_SUCCESS.getMessage(), updatedProduct, SuccessCode.MODIFIED_SUCCESS.getStatus());

    }

    @DeleteMapping("/{product_id}")
    public ResponseEntity<BaseResponse<?>> deleteProduct(@PathVariable("product_id") Long productId) {

        productService.deleteProduct(productId);

        return BaseResponse.ok(SuccessCode.DELETED_SUCCESS.getMessage(), SuccessCode.DELETED_SUCCESS.getStatus());
    }
}
