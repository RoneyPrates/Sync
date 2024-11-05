package com.example.sync.service;

import com.example.sync.model.Usuarios;
import com.example.sync.repository.UsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuariosService {

    @Autowired
    private UsuariosRepository usuariosRepository;

    public List<Usuarios> getAllUsuarios() {
        return usuariosRepository.findAll();
    }

    public Usuarios getUsuarioById(Long id) {
        return usuariosRepository.findById(id).orElse(null);
    }

    public String getNomeUsuarioById(Long id) {
        Usuarios usuario = getUsuarioById(id);
        return usuario != null ? usuario.getNome() : null;
    }

    public Usuarios createUsuario(Usuarios usuario) {
        return usuariosRepository.save(usuario);
    }

    public Usuarios updateUsuario(Long id, Usuarios usuario) {
        if (usuariosRepository.existsById(id)) {
            usuario.setId(id);
            return usuariosRepository.save(usuario);
        } else {
            return null;
        }
    }
    public boolean deleteUsuario(Long id) {
        if (usuariosRepository.existsById(id)) {
            usuariosRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }
    public Usuarios atualizarStatus(Long id, boolean ativo) {
        Optional<Usuarios> optionalUsuario = usuariosRepository.findById(id);
        if (optionalUsuario.isPresent()) {
            Usuarios usuarios = optionalUsuario.get();
            usuarios.setAtivo(ativo);
            return usuariosRepository.save(usuarios);
        }
        return null;
    }
}
