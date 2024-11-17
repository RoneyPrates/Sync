package com.example.sync.controller;

import com.example.sync.model.NotaFiscal;
import com.example.sync.model.Usuarios;
import com.example.sync.repository.NotaFiscalRepository;
import com.example.sync.repository.UsuariosRepository;
import com.example.sync.service.LoginService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Timestamp;

@Controller
public class ConexaoController {

    @Autowired
    private LoginService loginService;
    @Autowired
    private NotaFiscalRepository notaFiscalRepository;
    @Autowired
    private UsuariosRepository usuariosRepository;

    @GetMapping("/login")
    public String showLoginPage() {
        return "login";
    }

    @PostMapping("/login")
    @ResponseBody
    public ResponseEntity<?> login(@RequestParam("email") String email,
                                   @RequestParam("password") String senha) {
        Usuarios usuario = loginService.autenticar(email, senha);

        if (usuario != null) {
            return ResponseEntity.ok(usuario);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário ou senha inválidos");
        }
    }

    @PostMapping("/uploadPdf")
    public String uploadPdf(@RequestParam("pdfFile") MultipartFile file,
                            HttpSession session,
                            RedirectAttributes redirectAttributes) {

        Long usuarioId = (Long) session.getAttribute("usuarioId");

        if (usuarioId == null) {
            redirectAttributes.addFlashAttribute("erro", "Usuário não autenticado.");
            return "redirect:/login";
        }

        if (file.isEmpty()) {
            redirectAttributes.addFlashAttribute("erro", "Por favor, selecione um arquivo PDF para fazer o upload.");
            return "redirect:/ordensdecompras.html";
        }
        try {
            if (!file.getContentType().equals("application/pdf")) {
                redirectAttributes.addFlashAttribute("erro", "Somente arquivos PDF são permitidos.");
                return "redirect:/ordensdecompras.html";
            }
            byte[] documento = file.getBytes();
            NotaFiscal notaFiscal = new NotaFiscal();
            notaFiscal.setDocumento(documento);
            notaFiscal.setDataCompra(new Timestamp(System.currentTimeMillis()));
            notaFiscal.setUsuarioId(usuarioId);

            notaFiscalRepository.save(notaFiscal);

            redirectAttributes.addFlashAttribute("sucesso", "Arquivo PDF enviado e compra finalizada com sucesso.");
            return "redirect:/ordensdecompras.html";

        } catch (IOException e) {
            redirectAttributes.addFlashAttribute("erro", "Erro ao salvar o arquivo: " + e.getMessage());
            return "redirect:/ordensdecompras.html";
        }
    }

    @GetMapping("/cadastroProdutos")
    public String showCadastroProdutos() {
        return "cadastroProdutos";
    }

    @GetMapping("/cadastroUsuarios")
    public String showCadastroUsuarios() {
        return "cadastroUsuarios";
    }

    @GetMapping("/cadastroFiliais")
    public String showCadastroFiliais() {
        return "cadastroFiliais";
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }
}
