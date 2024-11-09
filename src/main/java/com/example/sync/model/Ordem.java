package com.example.sync.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
public class Ordem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate dataOrdem;
    private BigDecimal valorOrdem;
    private String status;
    private String nomeUsuario;
    private String observacao;

    @ManyToOne
    @JoinColumn(name = "idFilial")
    private Filial filial;

    @OneToMany(mappedBy = "ordem")
    @JsonIgnore
    private List<NotaFiscal> notasFiscais;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDataOrdem() {
        return dataOrdem;
    }

    public void setDataOrdem(LocalDate dataOrdem) {
        this.dataOrdem = dataOrdem;
    }

    public BigDecimal getValorOrdem() {
        return valorOrdem;
    }

    public void setValorOrdem(BigDecimal valorOrdem) {
        this.valorOrdem = valorOrdem;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }

    public String getNomeUsuario() {
        return nomeUsuario;
    }

    public void setNomeUsuario(String nomeUsuario) {
        this.nomeUsuario = nomeUsuario;
    }

    public Filial getFilial() {
        return filial;
    }

    public void setFilial(Filial filial) {
        this.filial = filial;
    }
}
