package com.example.sync.controller;

import com.example.sync.service.LoginService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Controller
public class ConexaoController {
    @Autowired
    private LoginService loginService;

    @GetMapping("/login")
    public String showLoginPage() {
        return "login";
    }

    @PostMapping("/login")
    public String login(@RequestParam("email") String email,
                        @RequestParam("password") String senha,
                        Model model,
                        RedirectAttributes redirectAttributes,
                        HttpSession session) {
        Integer usuarioId = loginService.autenticar(email, senha);

        if (usuarioId != null) {
            session.setAttribute("usuarioId", usuarioId);
            redirectAttributes.addFlashAttribute("usuarios", email);
            return "redirect:/ordensdecompras.html";
        }

        model.addAttribute("erro", "Usuário ou senha inválidos");
        return "login";
    }

    @GetMapping("/permissoes")
    public String showPermissoesPage() {
        return "permissoes";
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
}
