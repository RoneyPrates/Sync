package com.example.sync.repository;

import com.example.sync.model.OrdemProdutos;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrdemProdutoRepository extends JpaRepository<OrdemProdutos, Long> {
}
