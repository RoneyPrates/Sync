package com.example.sync.repository;

import com.example.sync.model.Ordem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrdemRepository extends JpaRepository<Ordem, Long> {
    List<Ordem> findByUsuarioId(Long usuarioId);
}