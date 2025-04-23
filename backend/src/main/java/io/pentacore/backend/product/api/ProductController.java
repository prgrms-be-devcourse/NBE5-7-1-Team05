package io.pentacore.backend.product.api;


import io.pentacore.backend.global.unit.BaseResponse;
import io.pentacore.backend.product.domain.Product;
import io.pentacore.backend.product.app.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {


    private final ProductService productService;

    //전체 상품 조회
    @ResponseStatus(HttpStatus.OK)
    @GetMapping
    public BaseResponse<List<Product>> getAllProduct() {
        List<Product> products = productService.getAllProduct();
        return BaseResponse.ok(products);
    }

}
