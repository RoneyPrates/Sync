package com.example.sync.repository;

import com.example.sync.model.NotaFiscal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NotaFiscalRepository extends JpaRepository<NotaFiscal, Long> {
    Optional<NotaFiscal> findByOrdemId(Long ordemId);
}
