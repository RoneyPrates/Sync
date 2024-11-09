package com.example.sync.service;

import com.example.sync.model.Filial;
import com.example.sync.model.Produto;
import com.example.sync.repository.FilialRepository;
import com.example.sync.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProdutoService {
    @Autowired
    private ProdutoRepository produtoRepository;

    public Optional<Produto> obterProdutoPorId(Long id) {
        return produtoRepository.findById(id);
    }

    public List<Produto> obterTodosProdutos() {
        return produtoRepository.findAll();
    }

    public Produto adicionarProduto(Produto produto) {
        return produtoRepository.save(produto);
    }
    @Transactional
    public void inativarProduto(int id) {
        produtoRepository.inativarProduto(id);
    }
}
