package com.karensanchez.bugtracker.model;

/**
 * Estados del ciclo de vida de un bug.
 * Todo bug nuevo empieza en ABIERTO (las transiciones llegan en HU-5).
 */
public enum Estado {
    ABIERTO("Abierto"),
    EN_PROGRESO("En progreso"),
    RESUELTO("Resuelto"),
    CERRADO("Cerrado");

    private final String etiqueta;

    Estado(String etiqueta) {
        this.etiqueta = etiqueta;
    }

    public String getEtiqueta() {
        return etiqueta;
    }
}
