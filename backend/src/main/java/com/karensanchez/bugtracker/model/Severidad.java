package com.karensanchez.bugtracker.model;

/**
 * Valores posibles de Severidad.
 * En el JSON viajan como BAJA, MEDIA, ALTA, CRITICA;
 * "etiqueta" es el texto amigable que se muestra al usuario.
 */
public enum Severidad {
    BAJA("Baja"),
    MEDIA("Media"),
    ALTA("Alta"),
    CRITICA("Crítica");

    private final String etiqueta;

    Severidad(String etiqueta) {
        this.etiqueta = etiqueta;
    }

    public String getEtiqueta() {
        return etiqueta;
    }
}
