package io.pentacore.backend.admin.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access= AccessLevel.PROTECTED)
public class Admin {

    @Id
    @Column(name="admin_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length=40, nullable=false)
    private String email;

    @Column(nullable=false)
    private String password;

    // TODO : 나중에 지우기 (테스트 용)
    @Builder
    public Admin(Long id, String email, String password) {
        this.id = id;
        this.email = email;
        this.password = password;
    }
}
