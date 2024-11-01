package com.example.sync.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "usuarios")
public class Usuarios {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nome;
    private String email;
    private String senha;

    @ManyToOne
    @JoinColumn(name = "idtipousuario")
    private TipoUsuarios tipoUsuario;

    @ManyToOne
    @JoinColumn(name = "idfilial")
    private Filial filial;

    @ElementCollection
    @CollectionTable(name = "usuario_permissoes", joinColumns = @JoinColumn(name = "usuario_id"))
    @Column(name = "permissao")
    private List<String> permissoes;

    private Boolean ativo;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public TipoUsuarios getTipoUsuario() {
        return tipoUsuario;
    }

    public void setTipoUsuario(TipoUsuarios tipoUsuario) {
        this.tipoUsuario = tipoUsuario;
    }

    public Filial getFilial() {
        return filial;
    }

    public void setFilial(Filial filial) {
        this.filial = filial;
    }
    public List<String> getPermissoes() {
        return permissoes;
    }
    public void setPermissoes(List<String> permissoes) {
        this.permissoes = permissoes;
    }
    public Boolean getAtivo() {
        return ativo;
    }
    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }
}
