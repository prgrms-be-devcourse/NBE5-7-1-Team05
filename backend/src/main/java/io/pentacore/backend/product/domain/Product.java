package io.pentacore.backend.product.domain;

import io.pentacore.backend.admin.domain.Admin;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@Table(name = "products")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Product {


    @Id
    @Column(name ="product_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "admin_id")
    private Admin admin;

    @Column(length = 10 , nullable = false)
    private String name;

    @Column(length = 10 ,nullable = false)
    private String category;

    @Column( nullable = false,columnDefinition = "INT UNSIGNED")
    private Integer price;

    @Column(length = 255)
    private String imageUrl;

    @Column(nullable = false)
    private Integer stock;

    @Column(name = "is_deleted")
    private boolean isDeleted = false;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    public void softDelete() {
        this.isDeleted = true;
        this.deletedAt = LocalDateTime.now();
    }

//    public void restore() {
//        this.isDeleted = false;
//        this.deletedAt = null;
//    }


    public void changeStock(Integer stock) {
        if(this.stock + stock < 0) {
            this.stock = 0;
        } else {
            this.stock = this.stock + stock;
        }
    }

    @Builder
    public Product(long id, Admin admin, String name, String category, Integer price, String imageUrl, Integer stock) {
        // TODO: ID 직접 넣어주는 것 추후 제거
        this.id = id;
        this.admin = admin;
        this.name = name;
        this.category = category;
        this.price = price;
        this.imageUrl = imageUrl;
        this.stock = stock;
    }
}
