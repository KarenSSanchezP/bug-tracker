package com.karensanchez.bugtracker.controller;

import com.karensanchez.bugtracker.dto.BugResponse;
import com.karensanchez.bugtracker.dto.CrearBugRequest;
import com.karensanchez.bugtracker.service.BugService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/**
 * Endpoints REST de bugs bajo /api/bugs.
 */
@RestController
@RequestMapping("/api/bugs")
public class BugController {

    private final BugService bugService;

    public BugController(BugService bugService) {
        this.bugService = bugService;
    }

    /** POST /api/bugs: crea un bug. @Valid activa las validaciones del DTO. Responde 201. */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BugResponse crear(@Valid @RequestBody CrearBugRequest request) {
        return bugService.crear(request);
    }

    /** GET /api/bugs: lista los bugs, más recientes primero. */
    @GetMapping
    public List<BugResponse> listar() {
        return bugService.listar();
    }
}
