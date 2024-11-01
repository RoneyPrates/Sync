package com.example.sync.repository;

import com.example.sync.model.Usuarios;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuariosRepository extends JpaRepository<Usuarios, Integer> {
    Usuarios findByEmail(String email);
}
