package com.example.sync.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
public class Ordem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate dataOrdem;
    private BigDecimal valorOrdem;
    private String status;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    private String observacao;

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
    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }
}
