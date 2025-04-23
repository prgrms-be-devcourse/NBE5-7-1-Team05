package io.pentacore.backend.product.api;

import io.pentacore.backend.global.unit.BaseResponse;
import io.pentacore.backend.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/products")
public class AdminProductController {

    private final ProductService productService;

    @ResponseStatus(HttpStatus.OK)
    @DeleteMapping("/{product_id}")
    public BaseResponse<?> deleteProduct(@PathVariable("product_id") Long productId) {

        productService.deleteProduct(productId);

        return BaseResponse.ok();
    }
}
