package com.example.sync.controller;

import com.example.sync.model.Filial;
import com.example.sync.service.FilialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/filial")
public class FilialController {
    @Autowired
    private FilialService filialService;

    @GetMapping("/{id}")
    public ResponseEntity<Filial> obterFilial(@PathVariable int id) {
        return filialService.obterFilialPorId(id)
                .map(filial -> ResponseEntity.ok(filial))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Filial>> obterTodasFiliais() {
        List<Filial> filiais = filialService.obterTodasFiliais();
        return ResponseEntity.ok(filiais);
    }
}
