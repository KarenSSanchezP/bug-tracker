package com.karensanchez.bugtracker.dto;

import com.karensanchez.bugtracker.model.Prioridad;
import com.karensanchez.bugtracker.model.Severidad;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

/** Pruebas de valores límite de las validaciones del DTO (CP-02 a CP-14). */
class CrearBugRequestValidationTest {

    private static Validator validator;

    @BeforeAll
    static void setUp() {
        validator = Validation.buildDefaultValidatorFactory().getValidator();
    }

    private Set<ConstraintViolation<CrearBugRequest>> validar(String titulo, String descripcion, Prioridad p, Severidad s) {
        return validator.validate(new CrearBugRequest(titulo, descripcion, p, s));
    }

    private boolean tieneErrorEn(Set<ConstraintViolation<CrearBugRequest>> errores, String campo) {
        return errores.stream().anyMatch(v -> v.getPropertyPath().toString().equals(campo));
    }

    @Test
    void requestValido_noTieneErrores() {
        assertThat(validar("Error", "Detalle", Prioridad.ALTA, Severidad.MEDIA)).isEmpty();
    }

    @ParameterizedTest
    @ValueSource(ints = {1, 149, 150})
    void titulo_dentroDelLimite_esValido(int largo) {
        assertThat(validar("a".repeat(largo), "Detalle", Prioridad.ALTA, Severidad.MEDIA)).isEmpty();
    }

    @Test
    void titulo_151Caracteres_esInvalido() {
        assertThat(tieneErrorEn(validar("a".repeat(151), "Detalle", Prioridad.ALTA, Severidad.MEDIA), "titulo")).isTrue();
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "   "})
    void titulo_vacioOSoloEspacios_esInvalido(String titulo) {
        assertThat(tieneErrorEn(validar(titulo, "Detalle", Prioridad.ALTA, Severidad.MEDIA), "titulo")).isTrue();
    }

    @Test
    void titulo_nulo_esInvalido() {
        assertThat(tieneErrorEn(validar(null, "Detalle", Prioridad.ALTA, Severidad.MEDIA), "titulo")).isTrue();
    }

    @Test
    void descripcion_2000_esValida_y_2001_esInvalida() {
        assertThat(validar("Error", "a".repeat(2000), Prioridad.ALTA, Severidad.MEDIA)).isEmpty();
        assertThat(tieneErrorEn(validar("Error", "a".repeat(2001), Prioridad.ALTA, Severidad.MEDIA), "descripcion")).isTrue();
    }

    @Test
    void descripcion_vacia_esInvalida() {
        assertThat(tieneErrorEn(validar("Error", "", Prioridad.ALTA, Severidad.MEDIA), "descripcion")).isTrue();
    }

    @Test
    void prioridadYSeveridad_nulas_sonInvalidas() {
        var errores = validar("Error", "Detalle", null, null);
        assertThat(tieneErrorEn(errores, "prioridad")).isTrue();
        assertThat(tieneErrorEn(errores, "severidad")).isTrue();
    }
}
