package com.example.sync.service;

import com.example.sync.model.Usuarios;
import com.example.sync.repository.UsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuariosService {
    private final PasswordEncoder passwordEncoder;
    private final UsuariosRepository usuariosRepository;

    @Autowired
    public UsuariosService(PasswordEncoder passwordEncoder, UsuariosRepository usuariosRepository) {
        this.passwordEncoder = passwordEncoder;
        this.usuariosRepository = usuariosRepository;
    }

    public boolean authenticate(String email, String senha) {
        Usuarios usuarios = usuariosRepository.findByEmail(email);
        if (usuarios != null) {
            return passwordEncoder.matches(senha, usuarios.getSenha());
        }
        return false;
    }
}
