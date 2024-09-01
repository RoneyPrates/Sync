package com.example.sync.controller;

import com.example.sync.model.Ordem;
import com.example.sync.service.OrdemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ordensdecompras")
public class OrdemController {

    @Autowired
    private OrdemService ordemService;

    @GetMapping
    public List<Ordem> getAllOrders() {
        return ordemService.getAllOrdens();
    }
}
