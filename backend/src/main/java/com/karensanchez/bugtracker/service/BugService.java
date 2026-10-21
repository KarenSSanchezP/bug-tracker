package com.karensanchez.bugtracker.service;

import com.karensanchez.bugtracker.dto.BugResponse;
import com.karensanchez.bugtracker.dto.CrearBugRequest;
import com.karensanchez.bugtracker.model.Bug;
import com.karensanchez.bugtracker.repository.BugRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Lógica de negocio de los bugs. El controlador solo recibe/responde HTTP
 * y delega aquí todo lo demás.
 */
@Service
public class BugService {

    private final BugRepository bugRepository;

    // Inyección por constructor: Spring pasa el repositorio automáticamente.
    public BugService(BugRepository bugRepository) {
        this.bugRepository = bugRepository;
    }

    /** Crea un bug nuevo. El estado (ABIERTO) y la fecha los pone la entidad al guardarse. */
    @Transactional
    public BugResponse crear(CrearBugRequest request) {
        Bug bug = new Bug();
        bug.setTitulo(request.titulo().trim());
        bug.setDescripcion(request.descripcion().trim());
        bug.setPrioridad(request.prioridad());
        bug.setSeveridad(request.severidad());
        return BugResponse.desde(bugRepository.save(bug));
    }

    /** Lista todos los bugs, los más recientes primero. */
    @Transactional(readOnly = true)
    public List<BugResponse> listar() {
        return bugRepository.findAllByOrderByFechaCreacionDescIdDesc()
                .stream()
                .map(BugResponse::desde)
                .toList();
    }
}
