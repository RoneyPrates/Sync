package com.example.sync.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "filiais")
public class Filial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String cnpj;
    private String cidade;
    private String estado;
    private Boolean ativo;

    @OneToMany(mappedBy = "filial")
    @JsonIgnore
    private List<Ordem> ordens;

    public Filial() {}

    public Filial(String nome, String cnpj, String cidade, String estado) {
        this.nome = nome;
        this.cnpj = cnpj;
        this.cidade = cidade;
        this.estado = estado;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public List<Ordem> getOrdens() {
        return ordens;
    }

    public void setOrdens(List<Ordem> ordens) {
        this.ordens = ordens;
    }
}