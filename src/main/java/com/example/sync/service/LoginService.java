package com.example.sync.service;

import com.example.sync.model.Usuarios;
import com.example.sync.repository.UsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LoginService {
    @Autowired
    private UsuariosRepository usuariosRepository;

    public Usuarios autenticar(String email, String senha) {
        Optional<Usuarios> usuarioOpt = usuariosRepository.findByEmailAndSenha(email, senha);
        return usuarioOpt.orElse(null);
    }

    private boolean senhaCorreta(String senhaArmazenada, String senhaFornecida) {
        return senhaArmazenada.equals(senhaFornecida);
    }
}