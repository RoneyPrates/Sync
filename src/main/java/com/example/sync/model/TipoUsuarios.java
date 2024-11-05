package com.example.sync.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tipousuarios")
public class TipoUsuarios {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idTipoUsuario;

    @Column(name = "nome_tipo_usuario", nullable = false, length = 50)
    private String nomeTipoUsuario;

    public TipoUsuarios() {}

    public Integer getIdTipoUsuario() {
        return idTipoUsuario;
    }

    public void setIdTipoUsuario(Integer idTipoUsuario) {
        this.idTipoUsuario = idTipoUsuario;
    }

    public String getNomeTipoUsuario() {
        return nomeTipoUsuario;
    }

    public void setNomeTipoUsuario(String nomeTipoUsuario) {
        this.nomeTipoUsuario = nomeTipoUsuario;
    }

    @Override
    public String toString() {
        return "TipoUsuarios{" +
                "idTipoUsuario=" + idTipoUsuario +
                ", nomeTipoUsuario='" + nomeTipoUsuario + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TipoUsuarios)) return false;
        TipoUsuarios that = (TipoUsuarios) o;
        return idTipoUsuario != null && idTipoUsuario.equals(that.idTipoUsuario);
    }

    @Override
    public int hashCode() {
        return 31;
    }
}