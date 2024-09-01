package com.example.sync.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ConexaoController {


    @GetMapping("/login")
    public String login() {
        return "login";
    }
}
