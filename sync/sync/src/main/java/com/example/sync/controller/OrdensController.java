package com.example.sync.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class OrdensController {

    @GetMapping("/ordensdecompras")
    public String ordensdecompras() {
        return "ordensdecompras";
    }
}
