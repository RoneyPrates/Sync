package com.example.sync.controller;

import com.example.sync.model.NotaFiscal;
import com.example.sync.repository.NotaFiscalRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class NotaFiscalController {

    @Autowired
    private NotaFiscalRepository notaFiscalRepository;

    @Transactional
    @GetMapping("/notasfiscais/ordem/{id}/baixar")
    public ResponseEntity<ByteArrayResource> baixarNotaFiscalPorOrdem(@PathVariable Long id) throws IOException {
        NotaFiscal notaFiscal = notaFiscalRepository.findByOrdemId(id)
                .orElseThrow(() -> new IllegalArgumentException("Nota fiscal não encontrada para a ordem com id " + id));

        byte[] documento = notaFiscal.getDocumento();
        ByteArrayResource resource = new ByteArrayResource(documento);

        return ResponseEntity.ok()
                .header("Content-Disposition", "inline; filename=nota_fiscal_" + id + ".pdf")  // Mude para 'inline'
                .contentType(MediaType.APPLICATION_PDF)
                .contentLength(documento.length)
                .body(resource);
    }

}
