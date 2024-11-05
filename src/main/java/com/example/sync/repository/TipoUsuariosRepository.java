package com.example.sync.repository;

import com.example.sync.model.TipoUsuarios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoUsuariosRepository extends JpaRepository<TipoUsuarios, Long> {
    TipoUsuarios findByNomeTipoUsuario(String nomeTipoUsuario);

    @Query("SELECT t FROM TipoUsuarios t WHERE t.idTipoUsuario = ?1")
    TipoUsuarios findByIdTipoUsuario(Integer id);
}
