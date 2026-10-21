package com.karensanchez.bugtracker.dto;

import com.karensanchez.bugtracker.model.Bug;
import com.karensanchez.bugtracker.model.Estado;
import com.karensanchez.bugtracker.model.Prioridad;
import com.karensanchez.bugtracker.model.Severidad;
import java.time.LocalDateTime;

/**
 * Lo que la API devuelve al cliente. Separarlo de la entidad evita
 * exponer detalles internos de la base de datos.
 */
public record BugResponse(
        Long id,
        String titulo,
        String descripcion,
        Prioridad prioridad,
        Severidad severidad,
        Estado estado,
        LocalDateTime fechaCreacion
) {
    /** Convierte una entidad Bug en su DTO de respuesta. */
    public static BugResponse desde(Bug bug) {
        return new BugResponse(
                bug.getId(),
                bug.getTitulo(),
                bug.getDescripcion(),
                bug.getPrioridad(),
                bug.getSeveridad(),
                bug.getEstado(),
                bug.getFechaCreacion());
    }
}
