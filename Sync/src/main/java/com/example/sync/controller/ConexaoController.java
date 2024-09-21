package com.example.sync.controller;

import com.example.sync.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

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
                        @RequestParam("senha") String senha,
                        @RequestParam("pagina") String pagina,
                        Model model) {
        boolean autenticado = loginService.autenticar(email, senha);
        if (autenticado) {
            model.addAttribute("usuario", email);
            if ("pagBoot".equals(pagina)) {
                return "redirect:/ordensdecompras";
            } else if ("pagPure".equals(pagina)) {
                model.addAttribute("erro", "Usuário ou senha inválidos");;
            }
        }
        return "login";
}
}
