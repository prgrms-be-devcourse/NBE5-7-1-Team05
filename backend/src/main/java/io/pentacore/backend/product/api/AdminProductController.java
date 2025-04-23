package io.pentacore.backend.product.api;

import io.pentacore.backend.global.unit.BaseResponse;
import io.pentacore.backend.product.domain.Product;
import io.pentacore.backend.product.dto.UpdateRequest;
import io.pentacore.backend.product.app.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/products")
public class AdminProductController {

    private final ProductService productService;

    @PutMapping("/{productId}")
    public io.pentacore.backend.config.BaseResponse<Product> updateProductStock(@PathVariable Long productId, @RequestBody UpdateRequest updateRequest) {

        Product updatedProduct = productService.updateProductStock(productId, updateRequest);

        return io.pentacore.backend.config.BaseResponse.ok(updatedProduct);

    }

    @ResponseStatus(HttpStatus.OK)
    @DeleteMapping("/{product_id}")
    public BaseResponse<?> deleteProduct(@PathVariable("product_id") Long productId) {

        productService.deleteProduct(productId);

        return BaseResponse.ok();
    }
}
