package com.example.sync.model;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
public class NotaFiscal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuarioid")
    private Long usuarioId;

    @Lob
    @Column(name = "documento")
    private byte[] documento;

    @Column(name = "datacompra")
    private Timestamp dataCompra;

    @ManyToOne
    @JoinColumn(name = "ordem_id", nullable = false)
    private Ordem ordem;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public byte[] getDocumento() {
        return documento;
    }

    public void setDocumento(byte[] documento) {
        this.documento = documento;
    }

    public Timestamp getDataCompra() {
        return dataCompra;
    }

    public void setDataCompra(Timestamp dataCompra) {
        this.dataCompra = dataCompra;
    }
    public Ordem getOrdem() {
        return ordem;
    }

    public void setOrdem(Ordem ordem) {
        this.ordem = ordem;
    }
}

