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
    private String numeroOrdem;
    private LocalDate dataOrdem;
    private BigDecimal valorOrdem;

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumber() {
        return numeroOrdem;
    }

    public void setNumber(String numeroOrdem) {
        this.numeroOrdem = numeroOrdem;
    }

    public LocalDate getDate() {
        return dataOrdem;
    }

    public void setDate(LocalDate dataOrdem) {
        this.dataOrdem = dataOrdem;
    }

    public BigDecimal getValue() {
        return valorOrdem;
    }

    public void setValue(BigDecimal valorOrdem) {
        this.valorOrdem = valorOrdem;
    }
}
