package com.duantn.be_project.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.duantn.be_project.model.Voucher;



public interface VoucherSellerRepository extends JpaRepository<Voucher, Integer> {
    @Query("""
            select v from Voucher v where v.productDetail.product.store.id = ?1
            """)
        List<Voucher> findAllByIdStore(Integer idStore);
}
