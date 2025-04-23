package io.pentacore.backend.product.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Products {


    @Id
    @Column(name ="product_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;


    @ManyToOne
    @JoinColumn(name = "admin_id")
    private long admin;

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

}
