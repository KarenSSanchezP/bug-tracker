package com.karensanchez.bugtracker.repository;

import com.karensanchez.bugtracker.model.Bug;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Acceso a datos de Bug. Spring Data genera la implementación sola.
 */
public interface BugRepository extends JpaRepository<Bug, Long> {

    /** Spring arma la consulta a partir del nombre: todos, del más reciente al más antiguo. */
    List<Bug> findAllByOrderByFechaCreacionDescIdDesc();
}
