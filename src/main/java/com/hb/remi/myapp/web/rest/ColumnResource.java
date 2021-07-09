package com.hb.remi.myapp.web.rest;

import com.hb.remi.myapp.domain.Column;
import com.hb.remi.myapp.repository.ColumnRepository;
import com.hb.remi.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.hb.remi.myapp.domain.Column}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ColumnResource {

    private final Logger log = LoggerFactory.getLogger(ColumnResource.class);

    private static final String ENTITY_NAME = "column";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ColumnRepository columnRepository;

    public ColumnResource(ColumnRepository columnRepository) {
        this.columnRepository = columnRepository;
    }

    /**
     * {@code POST  /columns} : Create a new column.
     *
     * @param column the column to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new column, or with status {@code 400 (Bad Request)} if the column has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/columns")
    public ResponseEntity<Column> createColumn(@RequestBody Column column) throws URISyntaxException {
        log.debug("REST request to save Column : {}", column);
        if (column.getId() != null) {
            throw new BadRequestAlertException("A new column cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Column result = columnRepository.save(column);
        return ResponseEntity
            .created(new URI("/api/columns/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /columns/:id} : Updates an existing column.
     *
     * @param id the id of the column to save.
     * @param column the column to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated column,
     * or with status {@code 400 (Bad Request)} if the column is not valid,
     * or with status {@code 500 (Internal Server Error)} if the column couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/columns/{id}")
    public ResponseEntity<Column> updateColumn(@PathVariable(value = "id", required = false) final Long id, @RequestBody Column column)
        throws URISyntaxException {
        log.debug("REST request to update Column : {}, {}", id, column);
        if (column.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, column.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!columnRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Column result = columnRepository.save(column);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, column.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /columns/:id} : Partial updates given fields of an existing column, field will ignore if it is null
     *
     * @param id the id of the column to save.
     * @param column the column to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated column,
     * or with status {@code 400 (Bad Request)} if the column is not valid,
     * or with status {@code 404 (Not Found)} if the column is not found,
     * or with status {@code 500 (Internal Server Error)} if the column couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/columns/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Column> partialUpdateColumn(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Column column
    ) throws URISyntaxException {
        log.debug("REST request to partial update Column partially : {}, {}", id, column);
        if (column.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, column.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!columnRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Column> result = columnRepository
            .findById(column.getId())
            .map(
                existingColumn -> {
                    if (column.getName() != null) {
                        existingColumn.setName(column.getName());
                    }

                    return existingColumn;
                }
            )
            .map(columnRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, column.getId().toString())
        );
    }

    /**
     * {@code GET  /columns} : get all the columns.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of columns in body.
     */
    @GetMapping("/columns")
    public List<Column> getAllColumns() {
        log.debug("REST request to get all Columns");
        return columnRepository.findAll();
    }

    /**
     * {@code GET  /columns/:id} : get the "id" column.
     *
     * @param id the id of the column to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the column, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/columns/{id}")
    public ResponseEntity<Column> getColumn(@PathVariable Long id) {
        log.debug("REST request to get Column : {}", id);
        Optional<Column> column = columnRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(column);
    }

    /**
     * {@code DELETE  /columns/:id} : delete the "id" column.
     *
     * @param id the id of the column to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/columns/{id}")
    public ResponseEntity<Void> deleteColumn(@PathVariable Long id) {
        log.debug("REST request to delete Column : {}", id);
        columnRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
