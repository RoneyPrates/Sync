package com.example.sync.service;

import com.example.sync.model.TipoUsuarios;
import com.example.sync.repository.TipoUsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TipoUsuariosService {

    @Autowired
    private TipoUsuariosRepository tipoUsuariosRepository;

    public List<TipoUsuarios> getAllTipoUsuarios() {
        return tipoUsuariosRepository.findAll();
    }

    public Optional<TipoUsuarios> findById(Long id) {
        return tipoUsuariosRepository.findById(id);
    }

    public TipoUsuarios save(TipoUsuarios tipoUsuario) {
        return tipoUsuariosRepository.save(tipoUsuario);
    }

    public void deleteById(Long id) {
        tipoUsuariosRepository.deleteById(id);
    }
}
