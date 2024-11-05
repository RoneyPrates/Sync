package com.example.sync.service;

import com.example.sync.model.Filial;
import com.example.sync.repository.FilialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class FilialService {

    @Autowired
    private FilialRepository filialRepository;

    public Optional<Filial> obterFilialPorId(Long id) {
        return filialRepository.findById(id);
    }

    public List<Filial> obterTodasFiliais() {
        return filialRepository.findAll();
    }

    public Filial adicionarFilial(Filial filial) {
        return filialRepository.save(filial);
    }
    @Transactional
    public void inativarFilial(int id) {
        filialRepository.inativarFilial(id);
    }
}
