package com.example.sync.controller;

import com.example.sync.model.Filial;
import com.example.sync.service.FilialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/filial")
public class FilialController {
    @Autowired
    private FilialService filialService;

    @GetMapping("/{id}")
    public ResponseEntity<Filial> obterFilial(@PathVariable Long id) {
        return filialService.obterFilialPorId(id)
                .map(filial -> ResponseEntity.ok(filial))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Filial>> obterTodasFiliais() {
        List<Filial> filiais = filialService.obterTodasFiliais();
        return ResponseEntity.ok(filiais);
    }

    @PostMapping
    public ResponseEntity<Filial> adicionarFilial(@RequestBody Filial filial) {
        Filial novaFilial = filialService.adicionarFilial(filial);
        return ResponseEntity.status(201).body(novaFilial); // 201 Created
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> inativarFilial(@PathVariable int id) {
        filialService.inativarFilial(id);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/{id}")
    public ResponseEntity<Filial> atualizarFilial(@PathVariable Long id, @RequestBody Filial filial) {
        Optional<Filial> filialExistente = filialService.obterFilialPorId(id);
        if (filialExistente.isPresent()) {
            Filial filialAtualizada = filialExistente.get();
            filialAtualizada.setNome(filial.getNome());
            filialAtualizada.setCnpj(filial.getCnpj());
            filialAtualizada.setCidade(filial.getCidade());
            filialAtualizada.setEstado(filial.getEstado());
            filialService.adicionarFilial(filialAtualizada);
            return ResponseEntity.ok(filialAtualizada);
        }
        return ResponseEntity.notFound().build();
    }
}
