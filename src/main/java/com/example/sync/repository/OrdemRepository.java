package com.example.sync.repository;

import com.example.sync.model.Ordem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrdemRepository extends JpaRepository<Ordem, Long> {
}
