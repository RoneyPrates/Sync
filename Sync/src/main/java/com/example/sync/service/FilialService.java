package com.example.sync.service;

import com.example.sync.model.Filial;
import com.example.sync.repository.FilialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class FilialService {
    @Autowired
    private FilialRepository filialRepository;

    public Optional<Filial> obterFilialPorId(int id) {
        return filialRepository.findById(id);
    }
}
