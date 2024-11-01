package com.example.sync.service;

import com.example.sync.model.TipoUsuarios;
import com.example.sync.repository.TipoUsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TipoUsuariosService {

    @Autowired
    private TipoUsuariosRepository tipoUsuariosRepository;

    public List<TipoUsuarios> getAllTipoUsuarios() {
        return tipoUsuariosRepository.findAll();
    }
}
