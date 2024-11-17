package com.example.sync.service;

import com.example.sync.model.Filial;
import com.example.sync.model.Ordem;
import com.example.sync.model.OrdemProdutos;
import com.example.sync.model.Usuarios;
import com.example.sync.repository.FilialRepository;
import com.example.sync.repository.OrdemProdutoRepository;
import com.example.sync.repository.OrdemRepository;
import com.example.sync.repository.UsuariosRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrdemService {

    @Autowired
    private OrdemRepository ordemRepository;
    @Autowired
    private FilialRepository filialRepository;
    @Autowired
    private OrdemProdutoRepository ordemProdutoRepository;
    @Autowired
    private UsuariosRepository usuariosRepository;

    @Transactional
    public Ordem createOrdem(Ordem ordem) {
        Usuarios usuario = usuariosRepository.findById(ordem.getUsuario().getId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Filial filial = filialRepository.findById(ordem.getFilial().getId())
                .orElseThrow(() -> new RuntimeException("Filial não encontrada"));

        ordem.setUsuario(usuario);
        ordem.setFilial(filial);

        return ordemRepository.save(ordem);
    }

    public List<Ordem> getAllOrdens() {
        return ordemRepository.findAll();
    }

    public Optional<Ordem> getOrdemById(Long id) {
        return ordemRepository.findById(id);
    }

    public Ordem saveOrdem(Ordem ordem) {
        return ordemRepository.save(ordem);
    }
}