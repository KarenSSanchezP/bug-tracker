package com.karensanchez.bugtracker.service;

import com.karensanchez.bugtracker.dto.BugResponse;
import com.karensanchez.bugtracker.dto.CrearBugRequest;
import com.karensanchez.bugtracker.model.*;
import com.karensanchez.bugtracker.repository.BugRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Pruebas unitarias de BugService.
 * El repositorio es un "mock" (simulado): no tocamos la base de datos,
 * solo probamos la lógica del servicio.
 */
@ExtendWith(MockitoExtension.class)
class BugServiceTest {

    @Mock
    private BugRepository bugRepository;

    @InjectMocks
    private BugService bugService;

    /** Arma un Bug "como si lo hubiera guardado JPA" (con id, estado y fecha). */
    private Bug bugGuardado(Long id, String titulo, LocalDateTime fecha) {
        Bug bug = new Bug();
        bug.setTitulo(titulo);
        bug.setDescripcion("Descripción de prueba");
        bug.setPrioridad(Prioridad.ALTA);
        bug.setSeveridad(Severidad.MEDIA);
        ReflectionTestUtils.setField(bug, "id", id);
        ReflectionTestUtils.setField(bug, "estado", Estado.ABIERTO);
        ReflectionTestUtils.setField(bug, "fechaCreacion", fecha);
        return bug;
    }

    @Test
    void crear_datosValidos_devuelveBugAbiertoConIdYFecha() {
        // Arrange (preparar)
        LocalDateTime ahora = LocalDateTime.now();
        when(bugRepository.save(any(Bug.class))).thenReturn(bugGuardado(1L, "Error en login", ahora));
        CrearBugRequest request = new CrearBugRequest("Error en login", "No deja entrar", Prioridad.ALTA, Severidad.MEDIA);

        // Act (ejecutar)
        BugResponse respuesta = bugService.crear(request);

        // Assert (verificar)
        assertThat(respuesta.id()).isEqualTo(1L);
        assertThat(respuesta.estado()).isEqualTo(Estado.ABIERTO);
        assertThat(respuesta.fechaCreacion()).isEqualTo(ahora);
        verify(bugRepository, times(1)).save(any(Bug.class));
    }

    @Test
    void crear_pasaAlRepositorioLosDatosDelRequest() {
        when(bugRepository.save(any(Bug.class))).thenReturn(bugGuardado(1L, "Error", LocalDateTime.now()));
        ArgumentCaptor<Bug> captor = ArgumentCaptor.forClass(Bug.class);

        bugService.crear(new CrearBugRequest("Error", "Detalle", Prioridad.CRITICA, Severidad.BAJA));

        verify(bugRepository).save(captor.capture());
        Bug enviado = captor.getValue();
        assertThat(enviado.getTitulo()).isEqualTo("Error");
        assertThat(enviado.getDescripcion()).isEqualTo("Detalle");
        assertThat(enviado.getPrioridad()).isEqualTo(Prioridad.CRITICA);
        assertThat(enviado.getSeveridad()).isEqualTo(Severidad.BAJA);
    }

    @Test
    void crear_quitaEspaciosAlInicioYFinalDeTituloYDescripcion() {
        when(bugRepository.save(any(Bug.class))).thenReturn(bugGuardado(1L, "Error", LocalDateTime.now()));
        ArgumentCaptor<Bug> captor = ArgumentCaptor.forClass(Bug.class);

        bugService.crear(new CrearBugRequest("  Error  ", "  Detalle  ", Prioridad.ALTA, Severidad.ALTA));

        verify(bugRepository).save(captor.capture());
        assertThat(captor.getValue().getTitulo()).isEqualTo("Error");
        assertThat(captor.getValue().getDescripcion()).isEqualTo("Detalle");
    }

    @Test
    void listar_sinBugs_devuelveListaVacia() {
        when(bugRepository.findAllByOrderByFechaCreacionDescIdDesc()).thenReturn(List.of());

        assertThat(bugService.listar()).isEmpty();
    }

    @Test
    void listar_respetaElOrdenDelRepositorio_masRecientesPrimero() {
        LocalDateTime ahora = LocalDateTime.now();
        when(bugRepository.findAllByOrderByFechaCreacionDescIdDesc()).thenReturn(List.of(
                bugGuardado(3L, "Nuevo", ahora),
                bugGuardado(2L, "Medio", ahora.minusHours(1)),
                bugGuardado(1L, "Viejo", ahora.minusDays(1))));

        List<BugResponse> lista = bugService.listar();

        assertThat(lista).extracting(BugResponse::id).containsExactly(3L, 2L, 1L);
        verify(bugRepository).findAllByOrderByFechaCreacionDescIdDesc();
        verifyNoMoreInteractions(bugRepository);
    }
}
