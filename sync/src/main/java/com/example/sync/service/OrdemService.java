package com.example.sync.service;

import com.example.sync.model.Ordem;
import com.example.sync.repository.OrdemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrdemService {

    @Autowired
    private OrdemRepository ordemRepository;

    public List<Ordem> getAllOrdens() {
        return ordemRepository.findAll();
    }
}
