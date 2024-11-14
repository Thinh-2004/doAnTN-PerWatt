package com.duantn.be_project.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.duantn.be_project.model.VoucherDetail;

public interface VoucherDetailsSellerRepository extends JpaRepository<VoucherDetail, Integer> {

    // Truy vấn kiểm tra xem user đã nhận voucher hay chưa
    @Query("""
            select count(vd) > 0 from VoucherDetail vd where vd.user.id = ?1
             """)
    boolean existsByIdUser(Integer id);
}
