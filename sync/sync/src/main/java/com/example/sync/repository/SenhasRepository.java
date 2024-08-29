package com.example.sync.repository;

import com.example.sync.model.Senha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SenhasRepository extends JpaRepository<Senha, Long> {
    Senha findByUsuarioId(Long usuarioId);

}
