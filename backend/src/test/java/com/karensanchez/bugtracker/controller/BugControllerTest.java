package com.karensanchez.bugtracker.controller;

import com.karensanchez.bugtracker.dto.BugResponse;
import com.karensanchez.bugtracker.model.Estado;
import com.karensanchez.bugtracker.model.Prioridad;
import com.karensanchez.bugtracker.model.Severidad;
import com.karensanchez.bugtracker.service.BugService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Pruebas de la capa web (controlador + GlobalExceptionHandler) con MockMvc.
 * @WebMvcTest levanta solo la parte web; el servicio es un mock,
 * así probamos códigos HTTP y el formato del JSON de error sin base de datos.
 */
@WebMvcTest(BugController.class)
class BugControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BugService bugService;

    private static final String VALIDO = """
            {"titulo":"Error en login","descripcion":"No deja entrar","prioridad":"ALTA","severidad":"MEDIA"}
            """;

    private BugResponse respuestaEjemplo(long id) {
        return new BugResponse(id, "Error en login", "No deja entrar",
                Prioridad.ALTA, Severidad.MEDIA, Estado.ABIERTO, LocalDateTime.now());
    }

    private org.springframework.test.web.servlet.ResultActions post(String json) throws Exception {
        return mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                .post("/api/bugs").contentType(MediaType.APPLICATION_JSON).content(json));
    }

    @Test
    void crear_valido_responde201ConElBug() throws Exception {            // CP-01
        when(bugService.crear(any())).thenReturn(respuestaEjemplo(1L));

        post(VALIDO)
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.estado").value("ABIERTO"));
    }

    @Test
    void crear_tituloVacio_responde400ConErrorEnTitulo() throws Exception { // CP-02
        post("""
                {"titulo":"","descripcion":"x","prioridad":"ALTA","severidad":"MEDIA"}
                """)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.errores.titulo").value("El título es obligatorio"));
        verifyNoInteractions(bugService); // si falla la validación, no se llama al servicio
    }

    @Test
    void crear_titulo151_responde400() throws Exception {                  // CP-07
        post("{\"titulo\":\"" + "a".repeat(151) + "\",\"descripcion\":\"x\",\"prioridad\":\"ALTA\",\"severidad\":\"MEDIA\"}")
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errores.titulo").value("El título no puede tener más de 150 caracteres"));
    }

    @Test
    void crear_prioridadInvalida_responde400ConErrorEnPrioridad() throws Exception { // CP-12
        post("""
                {"titulo":"t","descripcion":"x","prioridad":"URGENTE","severidad":"MEDIA"}
                """)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errores.prioridad", containsString("Valores permitidos")));
    }

    @Test
    void crear_variosCamposInvalidos_unMensajePorCampo() throws Exception { // CP-15
        post("""
                {"titulo":"","descripcion":"","prioridad":null,"severidad":null}
                """)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errores", aMapWithSize(4)))
                .andExpect(jsonPath("$.errores.titulo").exists())
                .andExpect(jsonPath("$.errores.descripcion").exists())
                .andExpect(jsonPath("$.errores.prioridad").exists())
                .andExpect(jsonPath("$.errores.severidad").exists());
    }

    @Test
    void crear_jsonMalFormado_responde400ConErrorEnBody() throws Exception { // CP-17
        post("{\"titulo\":")
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errores.body").exists())
                .andExpect(content().string(not(containsString("Exception"))));
    }

    @Test
    void crear_cuerpoVacio_responde400ConErrorEnBody() throws Exception {
        post("")
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errores.body").exists());
    }

    @Test
    void crear_tipoDeDatoIncorrecto_responde400FormatoInvalido() throws Exception {
        post("""
                {"titulo":{"a":1},"descripcion":"x","prioridad":"ALTA","severidad":"MEDIA"}
                """)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errores.titulo").value("Formato de dato inválido"));
    }

    @Test
    void listar_sinBugs_responde200ConListaVacia() throws Exception {      // CP-19
        when(bugService.listar()).thenReturn(List.of());

        mockMvc.perform(get("/api/bugs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void listar_conBugs_respetaElOrdenDelServicio() throws Exception {     // CP-21/22
        when(bugService.listar()).thenReturn(List.of(respuestaEjemplo(3L), respuestaEjemplo(2L)));

        mockMvc.perform(get("/api/bugs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].id", contains(3, 2)))
                .andExpect(jsonPath("$[0].fechaCreacion").exists());
    }
}
