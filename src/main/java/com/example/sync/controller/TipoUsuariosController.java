package com.example.sync.controller;

import com.example.sync.model.TipoUsuarios;
import com.example.sync.service.TipoUsuariosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/tipousuarios")
public class TipoUsuariosController {

    @Autowired
    private TipoUsuariosService tipoUsuariosService;

    @GetMapping
    public List<TipoUsuarios> getAllTipoUsuarios() {
        return tipoUsuariosService.getAllTipoUsuarios();
    }
}
