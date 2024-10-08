package com.example.sync.repository;

import com.example.sync.model.Usuarios;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuariosRepository extends JpaRepository <Usuarios, Integer> {
    Usuarios findByEmail(String email);
    Usuarios findBySenha(String senha);
}
