package com.example.sync.repository;

import com.example.sync.model.Filial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FilialRepository extends JpaRepository<Filial, Long> {
    @Modifying
    @Query("UPDATE Filial f SET f.ativo = false WHERE f.id = :id")
    void inativarFilial(@Param("id") int id);
}