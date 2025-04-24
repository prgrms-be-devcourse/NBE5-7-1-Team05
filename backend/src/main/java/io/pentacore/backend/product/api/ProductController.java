package io.pentacore.backend.product.api;

import io.pentacore.backend.global.unit.BaseResponse;
import io.pentacore.backend.product.app.ProductService;
import io.pentacore.backend.product.domain.Product;
import io.pentacore.backend.product.dto.ProductRequestDto;
import io.pentacore.backend.product.dto.ProductResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;
    @ResponseStatus(HttpStatus.OK)
    @GetMapping
    public BaseResponse<List<Product>> getAllProduct() {
        List<Product> products = productService.getAllProduct();
        return BaseResponse.ok(products);
    }

}
