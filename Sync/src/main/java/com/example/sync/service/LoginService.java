package com.example.sync.service;

import com.example.sync.model.Usuarios;
import com.example.sync.repository.UsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LoginService {
    @Autowired
    private UsuariosRepository usuarioRepository;

    public boolean autenticar(String email, String senha) {
        Usuarios usuarioEncontrado = usuarioRepository.findByEmail(email);
        return usuarioEncontrado != null && usuarioEncontrado.getSenha().equals(senha);
    }
}
