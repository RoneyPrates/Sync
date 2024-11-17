package com.example.sync.controller;

import com.example.sync.ProdutoOrdemDTO;
import com.example.sync.model.Ordem;
import com.example.sync.model.OrdemProdutos;
import com.example.sync.model.Produto;
import com.example.sync.repository.OrdemProdutoRepository;
import com.example.sync.repository.OrdemRepository;
import com.example.sync.repository.ProdutoRepository;
import com.example.sync.service.OrdemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/ordensdecompras")
public class OrdemController {

    @Autowired
    private OrdemService ordemService;
    @Autowired
    private OrdemRepository ordemRepository;
    @Autowired
    private ProdutoRepository produtoRepository;
    @Autowired
    private OrdemProdutoRepository ordemProdutoRepository;

    @GetMapping
    public List<Ordem> getAllOrders() {
        return ordemService.getAllOrdens();
    }

    @PostMapping
    public Ordem createOrdem(@RequestBody Ordem ordem) {
        return ordemService.createOrdem(ordem);
    }

    @GetMapping("/ordensdecompras")
    public ResponseEntity<List<Ordem>> getOrdens(@RequestParam Long usuarioId) {
        List<Ordem> ordens = ordemRepository.findByUsuarioId(usuarioId);

        if (ordens.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(ordens);
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
    @GetMapping("/{id}/produtos")
    public ResponseEntity<Ordem> obterProdutosDaOrdem(@PathVariable Long id) {
        Optional<Ordem> ordem = ordemService.getOrdemById(id);
        if (ordem.isPresent()) {
            return ResponseEntity.ok(ordem.get());
        }
        return ResponseEntity.notFound().build();
    }
    @PostMapping("/{id}/produtos")
    public ResponseEntity<?> adicionarProdutosNaOrdem(@PathVariable Long id, @RequestBody List<ProdutoOrdemDTO> produtosDTO) {
        Optional<Ordem> ordem = ordemService.getOrdemById(id);
        if (ordem.isPresent()) {
            for (ProdutoOrdemDTO produtoDTO : produtosDTO) {
                Produto produto = produtoRepository.findById(produtoDTO.getProdutoId())
                        .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

                OrdemProdutos ordemProduto = new OrdemProdutos();
                ordemProduto.setOrdem(ordem.get());
                ordemProduto.setProduto(produto);
                ordemProduto.setQuantidade(produtoDTO.getQuantidade());
                ordemProduto.setValorUnitario(produtoDTO.getValorUnitario());
                ordemProduto.setValorTotal(produtoDTO.getValorTotal());

                ordemProdutoRepository.save(ordemProduto);
            }

            return ResponseEntity.ok("Produtos adicionados com sucesso");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ordem não encontrada");
        }
    }
}