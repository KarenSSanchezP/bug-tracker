package com.karensanchez.bugtracker.exception;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import com.fasterxml.jackson.databind.JsonMappingException;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Atrapa los errores de toda la API y los convierte en un JSON con formato fijo:
 * {"status":400,"errores":{"campo":"mensaje"}}
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /** Falló alguna validación (@NotBlank, @Size, @NotNull...): un mensaje por campo. */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> manejarValidacion(MethodArgumentNotValidException ex) {
        Map<String, String> errores = new LinkedHashMap<>();
        // putIfAbsent: si un campo tiene varios errores, nos quedamos con el primero.
        ex.getBindingResult().getFieldErrors()
                .forEach(e -> errores.putIfAbsent(e.getField(), e.getDefaultMessage()));
        return respuesta400(errores);
    }

    /**
     * El cuerpo no se pudo leer: JSON mal formado o un valor de enum inválido
     * (por ejemplo "prioridad":"URGENTE").
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> manejarJsonInvalido(HttpMessageNotReadableException ex) {
        Map<String, String> errores = new LinkedHashMap<>();
        Throwable causa = ex.getCause();

        if (causa instanceof InvalidFormatException ife
                && ife.getTargetType() != null && ife.getTargetType().isEnum()
                && !ife.getPath().isEmpty()) {
            // Valor de enum que no existe: indicamos el campo y los valores válidos.
            String campo = ife.getPath().get(0).getFieldName();
            errores.put(campo, "Valor inválido. Valores permitidos: BAJA, MEDIA, ALTA, CRITICA");
        } else if (causa instanceof JsonMappingException jme && !jme.getPath().isEmpty()
                && jme.getPath().get(0).getFieldName() != null) {
            // Tipo de dato incorrecto en un campo concreto.
            errores.put(jme.getPath().get(0).getFieldName(), "Formato de dato inválido");
        } else {
            // JSON roto (falta una llave, una coma, etc.) o cuerpo vacío.
            errores.put("body", "El cuerpo de la petición no es un JSON válido");
        }
        return respuesta400(errores);
    }

    /** Arma la respuesta 400 con el formato acordado con QA. */
    private ResponseEntity<Map<String, Object>> respuesta400(Map<String, String> errores) {
        Map<String, Object> cuerpo = new LinkedHashMap<>();
        cuerpo.put("status", 400);
        cuerpo.put("errores", errores);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(cuerpo);
    }
}
