package com.example.sync.service;

import com.example.sync.model.Usuarios;
import com.example.sync.repository.UsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuariosService {

    @Autowired
    private UsuariosRepository usuariosRepository;

    public List<Usuarios> getAllUsuarios() {
        return usuariosRepository.findAll();
    }

    public Usuarios getUsuarioById(Integer id) {
        return usuariosRepository.findById(id).orElse(null);
    }

    public String getNomeUsuarioById(Integer id) {
        Usuarios usuario = getUsuarioById(id);
        return usuario != null ? usuario.getNome() : null;
    }

    public Usuarios createUsuario(Usuarios usuario) {
        return usuariosRepository.save(usuario);
    }

    public Usuarios updateUsuario(Integer id, Usuarios usuario) {
        if (usuariosRepository.existsById(id)) {
            usuario.setId(id);
            return usuariosRepository.save(usuario);
        } else {
            return null;
        }
    }

    public boolean deleteUsuario(Integer id) {
        if (usuariosRepository.existsById(id)) {
            usuariosRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }
}