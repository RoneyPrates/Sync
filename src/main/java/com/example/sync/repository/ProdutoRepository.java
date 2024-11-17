package com.example.sync.repository;
import com.example.sync.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    @Modifying
    @Query("UPDATE Produto f SET f.ativo = false WHERE f.id = :id")
    void inativarProduto(@Param("id") int id);
}