package com.example.sync.service;

import com.example.sync.model.Ordem;
import com.example.sync.repository.OrdemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrdemService {

    @Autowired
    private OrdemRepository ordemRepository;
    @Autowired
    private UsuariosService usuariosService;

    public Ordem createOrdem(Ordem ordem, Long usuarioId) {
        String nomeUsuario = usuariosService.getNomeUsuarioById(usuarioId);
        if (nomeUsuario != null) {
            ordem.setNomeUsuario(nomeUsuario);
        }
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
