package com.example.sync.service;

import com.example.sync.model.Usuarios;
import com.example.sync.repository.UsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LoginService {
    @Autowired
    private UsuariosRepository usuariosRepository;

    public Long autenticar(String email, String senha) {
        Usuarios usuarios = usuariosRepository.findByEmail(email);
        if (usuarios != null && senhaCorreta(usuarios.getSenha(), senha)) {
            return usuarios.getId();
        }
        return null;
    }

    private boolean senhaCorreta(String senhaArmazenada, String senhaFornecida) {
        return senhaArmazenada.equals(senhaFornecida);
    }
}