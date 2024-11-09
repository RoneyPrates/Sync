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

    @PatchMapping("/{id}/aprovarcompra")
    public ResponseEntity<?> compraAprovada(@PathVariable Long id) {
        Optional<Ordem> ordem = ordemService.getOrdemById(id);
        if (ordem.isPresent()) {
            Ordem ordemToUpdate = ordem.get();
            ordemToUpdate.setStatus("Compra Aprovada");
            ordemService.saveOrdem(ordemToUpdate);
            return ResponseEntity.ok(ordemToUpdate);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ordem não encontrada");
    }
    @PatchMapping("/{id}/efetuarcompra")
    public ResponseEntity<?> compraEfetuada(@PathVariable Long id) {
        Optional<Ordem> ordem = ordemService.getOrdemById(id);
        if (ordem.isPresent()) {
            Ordem ordemToUpdate = ordem.get();
            ordemToUpdate.setStatus("Compra Efetuada");
            ordemService.saveOrdem(ordemToUpdate);
            return ResponseEntity.ok(ordemToUpdate);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ordem não encontrada");
    }

    @PatchMapping("/{id}/reprovar")
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

    @PatchMapping("/{id}/deletar")
    public ResponseEntity<?> deleteOrdem(@PathVariable Long id) {
        Optional<Ordem> ordem = ordemService.getOrdemById(id);
        if (ordem.isPresent()) {
            Ordem ordemToUpdate = ordem.get();
            ordemToUpdate.setStatus("Deletada");
            ordemService.saveOrdem(ordemToUpdate);
            return ResponseEntity.ok(ordemToUpdate);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ordem não encontrada");
    }

    @PatchMapping("/{id}/finalizar")
    public ResponseEntity<?> finalizarOrdem(@PathVariable Long id) {
        Optional<Ordem> ordem = ordemService.getOrdemById(id);
        if (ordem.isPresent()) {
            Ordem ordemToUpdate = ordem.get();
            ordemToUpdate.setStatus("Finalizada");
            ordemService.saveOrdem(ordemToUpdate);
            return ResponseEntity.ok(ordemToUpdate);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ordem não encontrada");
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable Long id, @RequestBody Ordem ordemAtualizada) {
        Optional<Ordem> ordemExistente = ordemService.getOrdemById(id);
        if (ordemExistente.isPresent()) {
            Ordem ordemToUpdate = ordemExistente.get();
            ordemToUpdate.setObservacao(ordemAtualizada.getObservacao());
            ordemToUpdate.setDataOrdem(ordemAtualizada.getDataOrdem());
            ordemToUpdate.setValorOrdem(ordemAtualizada.getValorOrdem());

            Ordem updatedOrder = ordemService.saveOrdem(ordemToUpdate);
            return ResponseEntity.ok(updatedOrder);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ordem não encontrada");
    }
}