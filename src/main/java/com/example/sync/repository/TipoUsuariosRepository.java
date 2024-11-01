package com.example.sync.repository;

import com.example.sync.model.TipoUsuarios;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TipoUsuariosRepository extends JpaRepository<TipoUsuarios, Integer> {
    TipoUsuarios findByNomeTipoUsuario(String nomeTipoUsuario);
}
