package com.example.sync.controller;

import com.example.sync.model.Filial;
import com.example.sync.model.TipoUsuarios;
import com.example.sync.model.Usuarios;
import com.example.sync.service.FilialService;
import com.example.sync.service.TipoUsuariosService;
import com.example.sync.service.UsuariosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/usuarios")
public class UsuariosController {

    @Autowired
    private UsuariosService usuariosService;

    @Autowired
    private FilialService filialService;

    @Autowired
    private TipoUsuariosService tipoUsuariosService;

    @GetMapping
    public List<Usuarios> getAllUsuarios() {
        return usuariosService.getAllUsuarios();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuarios> getUsuarioById(@PathVariable Long id) {
        Usuarios usuario = usuariosService.getUsuarioById(id);
        if (usuario != null) {
            return ResponseEntity.ok(usuario);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createUsuario(@RequestBody Usuarios usuario) {
        try {
            if (usuario.getTipoUsuario() != null && usuario.getTipoUsuario().getIdTipoUsuario() != null) {
                TipoUsuarios tipoUsuario = tipoUsuariosService.findById(usuario.getTipoUsuario().getIdTipoUsuario().longValue())
                        .orElseThrow(() -> new RuntimeException("Tipo de usuário não encontrado"));
                usuario.setTipoUsuario(tipoUsuario);
            } else {
                return ResponseEntity.badRequest().body(new ApiResponse("Tipo de usuário é obrigatório."));
            }

            if (usuario.getFilial() != null && usuario.getFilial().getId() != null) {
                Filial filial = filialService.obterFilialPorId(usuario.getFilial().getId())
                        .orElseThrow(() -> new RuntimeException("Filial não encontrada"));
                usuario.setFilial(filial);
            } else {
                return ResponseEntity.badRequest().body(new ApiResponse("Filial é obrigatória."));
            }

            Usuarios novoUsuario = usuariosService.createUsuario(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoUsuario);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse("Erro ao criar usuário: " + e.getMessage()));
        }
    }
    public class ApiResponse {
        private String message;

        public ApiResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuarios> updateUsuario(@PathVariable Long id, @RequestBody Usuarios usuario) {
        Usuarios updatedUsuario = usuariosService.updateUsuario(id, usuario);
        if (updatedUsuario != null) {
            return ResponseEntity.ok(updatedUsuario);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Long id) {
        if (usuariosService.deleteUsuario(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @PatchMapping("/{id}")
    public ResponseEntity<?> atualizarStatusUsuario(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        try {
            boolean ativo = (Boolean) updates.get("ativo");
            Usuarios usuarios = usuariosService.atualizarStatus(id, ativo);

            if (usuarios == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao atualizar status do usuário");
        }
    }
}
