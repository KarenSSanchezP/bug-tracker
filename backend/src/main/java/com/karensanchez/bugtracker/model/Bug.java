package com.karensanchez.bugtracker.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entidad que representa un bug guardado en la tabla "bugs".
 */
@Entity
@Table(name = "bugs")
public class Bug {

    /** Identificador generado automáticamente por la base de datos. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(nullable = false, length = 2000)
    private String descripcion;

    /** EnumType.STRING guarda el texto (ej. "ALTA") en vez de un número; es más legible y seguro. */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Prioridad prioridad;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Severidad severidad;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Estado estado;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    /**
     * Se ejecuta justo antes de insertar: el servidor (no el cliente)
     * decide el estado inicial y la fecha de creación.
     */
    @PrePersist
    void alCrear() {
        this.estado = Estado.ABIERTO;
        this.fechaCreacion = LocalDateTime.now();
    }

    // ===== Getters y setters =====
    public Long getId() { return id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public Prioridad getPrioridad() { return prioridad; }
    public void setPrioridad(Prioridad prioridad) { this.prioridad = prioridad; }
    public Severidad getSeveridad() { return severidad; }
    public void setSeveridad(Severidad severidad) { this.severidad = severidad; }
    public Estado getEstado() { return estado; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
}
