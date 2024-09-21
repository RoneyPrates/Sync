package com.example.sync.controller;

import com.example.sync.model.Ordem;
import com.example.sync.service.OrdemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/ordensdecompras")
public class OrdemController {

    @Autowired
    private OrdemService ordemService;

    @GetMapping
    public List<Ordem> getAllOrders() {
        return ordemService.getAllOrdens();
    }

    @PostMapping
    public ResponseEntity<Ordem> createOrder(@RequestBody Ordem ordem) {
        try {
            Ordem createdOrder = ordemService.saveOrdem(ordem);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PatchMapping("/{id}/aprovar")
    public ResponseEntity<?> approveOrder(@PathVariable Long id) {
        Optional<Ordem> ordem = ordemService.getOrdemById(id);
        if (ordem.isPresent()) {
            Ordem ordemToUpdate = ordem.get();
            ordemToUpdate.setStatus("Aprovada");
            ordemService.saveOrdem(ordemToUpdate);
            return ResponseEntity.ok(ordemToUpdate);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ordem não encontrada");
    }

    @PatchMapping("/{id}/rejeitar")
    public ResponseEntity<?> rejectOrder(@PathVariable Long id) {
        Optional<Ordem> ordem = ordemService.getOrdemById(id);
        if (ordem.isPresent()) {
            Ordem ordemToUpdate = ordem.get();
            ordemToUpdate.setStatus("Reprovada");
            ordemService.saveOrdem(ordemToUpdate);
            return ResponseEntity.ok(ordemToUpdate);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ordem não encontrada");
    }

    @PatchMapping("/{id}/finalizar")
    public ResponseEntity<?> finalizeOrder(@PathVariable Long id) {
        Optional<Ordem> ordem = ordemService.getOrdemById(id);
        if (ordem.isPresent()) {
            Ordem ordemToUpdate = ordem.get();
            ordemToUpdate.setStatus("Finalizado");
            ordemService.saveOrdem(ordemToUpdate);
            return ResponseEntity.ok(ordemToUpdate);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ordem não encontrada");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        Optional<Ordem> ordem = ordemService.getOrdemById(id);
        if (ordem.isPresent()) {
            ordemService.deleteOrdem(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ordem não encontrada");
    }
}