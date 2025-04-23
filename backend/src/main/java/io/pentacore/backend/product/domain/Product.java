package io.pentacore.backend.product.domain;

import io.pentacore.backend.admin.domain.Admin;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

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

    public void addStock(Integer stock) {
        this.stock = this.stock + stock;
    }

    public void removeStock(Integer stock) {
        if( this.stock - stock < 0 ) {
            throw new IllegalArgumentException("재고가 부족합니다.");
        }

        this.stock = this.stock - stock;
    }

}
