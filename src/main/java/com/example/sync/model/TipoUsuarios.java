package com.example.sync.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tipousuarios")
public class TipoUsuarios {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer idTipoUsuario;
    String nomeTipoUsuario;

    public Integer getIdTipoUsuario() {return idTipoUsuario;}

    public void setIdTipoUsuario(Integer idTipoUsuario) {this.idTipoUsuario = idTipoUsuario;}

    public String getNomeTipoUsuario() {return nomeTipoUsuario;}

    public void setNomeTipoUsuario(String nomeTipoUsuario) {this.nomeTipoUsuario = nomeTipoUsuario;}
}
