package io.pentacore.backend.global.scheduler;


import io.pentacore.backend.product.app.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProductScheduler {

    private final ProductService productService;

    @Scheduled(cron = "0 0 0 * * ?")  // 매일 자정 00시 00분 00초에 삭제
    //@Scheduled(cron = "0 */3 * * * ?") // 3분마다 테스트용
    public void cleanupDeletedProducts(){
        productService.deleteExpiredProducts();
    }
}
