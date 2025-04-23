package io.pentacore.backend.admin.dao;

import io.pentacore.backend.admin.domain.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, Long> {
}
