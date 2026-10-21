package com.karensanchez.bugtracker.dto;

import com.karensanchez.bugtracker.model.Prioridad;
import com.karensanchez.bugtracker.model.Severidad;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Datos que el cliente envía para crear un bug.
 * A propósito NO incluye id, estado ni fechaCreacion: si el cliente los manda,
 * simplemente se ignoran, porque los define el servidor.
 */
public record CrearBugRequest(

        @NotBlank(message = "El título es obligatorio")
        @Size(max = 150, message = "El título no puede tener más de 150 caracteres")
        String titulo,

        @NotBlank(message = "La descripción es obligatoria")
        @Size(max = 2000, message = "La descripción no puede tener más de 2000 caracteres")
        String descripcion,

        @NotNull(message = "La prioridad es obligatoria")
        Prioridad prioridad,

        @NotNull(message = "La severidad es obligatoria")
        Severidad severidad
) {
}
