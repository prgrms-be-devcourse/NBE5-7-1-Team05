package io.pentacore.backend.admin.dao;


import io.pentacore.backend.admin.domain.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByAdminId(long adminId);
}
