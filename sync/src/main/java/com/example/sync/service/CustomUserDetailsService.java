package com.example.sync.service;

import com.example.sync.model.Usuarios;
import com.example.sync.repository.UsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuariosRepository usuariosRepository;

    @Override
    public UserDetails loadUserByUsername(String nome) throws UsernameNotFoundException {
        // Aqui 'username' deve corresponder ao nome que você deseja usar para autenticação
        Usuarios usuarios = usuariosRepository.findByNome(nome);
        if (usuarios == null) {
            throw new UsernameNotFoundException("Usuário não encontrado");
        }
        return new org.springframework.security.core.userdetails.User(
                usuarios.getUsername(),
                usuarios.getPassword(),
                new ArrayList<>()
        );
    }
}
