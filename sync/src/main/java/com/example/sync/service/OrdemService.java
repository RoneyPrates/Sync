package com.example.sync.service;

import com.example.sync.model.Ordem;
import com.example.sync.repository.OrdemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class OrdemService {

    @Autowired
    private OrdemRepository ordemRepository;

    // Método para criar uma nova ordem
    public Ordem createOrdem(String numeroOrdem, LocalDate dataOrdem, BigDecimal valorOrdem) {
        Ordem ordem = new Ordem();
        ordem.setNumber(numeroOrdem);
        ordem.setDate(dataOrdem);
        ordem.setValue(valorOrdem);

        return ordemRepository.save(ordem);
    }

    // Método para obter todas as ordens
    public List<Ordem> getAllOrdens() {
        return ordemRepository.findAll();
    }
}
