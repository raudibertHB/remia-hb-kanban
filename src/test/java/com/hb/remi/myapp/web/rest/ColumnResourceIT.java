package com.hb.remi.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.hb.remi.myapp.IntegrationTest;
import com.hb.remi.myapp.domain.Column;
import com.hb.remi.myapp.repository.ColumnRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ColumnResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ColumnResourceIT {

    private static final String ENTITY_API_URL = "/api/columns";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ColumnRepository columnRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restColumnMockMvc;

    private Column column;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Column createEntity(EntityManager em) {
        Column column = new Column();
        return column;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Column createUpdatedEntity(EntityManager em) {
        Column column = new Column();
        return column;
    }

    @BeforeEach
    public void initTest() {
        column = createEntity(em);
    }

    @Test
    @Transactional
    void createColumn() throws Exception {
        int databaseSizeBeforeCreate = columnRepository.findAll().size();
        // Create the Column
        restColumnMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(column)))
            .andExpect(status().isCreated());

        // Validate the Column in the database
        List<Column> columnList = columnRepository.findAll();
        assertThat(columnList).hasSize(databaseSizeBeforeCreate + 1);
        Column testColumn = columnList.get(columnList.size() - 1);
    }

    @Test
    @Transactional
    void createColumnWithExistingId() throws Exception {
        // Create the Column with an existing ID
        column.setId(1L);

        int databaseSizeBeforeCreate = columnRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restColumnMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(column)))
            .andExpect(status().isBadRequest());

        // Validate the Column in the database
        List<Column> columnList = columnRepository.findAll();
        assertThat(columnList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllColumns() throws Exception {
        // Initialize the database
        columnRepository.saveAndFlush(column);

        // Get all the columnList
        restColumnMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(column.getId().intValue())));
    }

    @Test
    @Transactional
    void getColumn() throws Exception {
        // Initialize the database
        columnRepository.saveAndFlush(column);

        // Get the column
        restColumnMockMvc
            .perform(get(ENTITY_API_URL_ID, column.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(column.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingColumn() throws Exception {
        // Get the column
        restColumnMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewColumn() throws Exception {
        // Initialize the database
        columnRepository.saveAndFlush(column);

        int databaseSizeBeforeUpdate = columnRepository.findAll().size();

        // Update the column
        Column updatedColumn = columnRepository.findById(column.getId()).get();
        // Disconnect from session so that the updates on updatedColumn are not directly saved in db
        em.detach(updatedColumn);

        restColumnMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedColumn.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedColumn))
            )
            .andExpect(status().isOk());

        // Validate the Column in the database
        List<Column> columnList = columnRepository.findAll();
        assertThat(columnList).hasSize(databaseSizeBeforeUpdate);
        Column testColumn = columnList.get(columnList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingColumn() throws Exception {
        int databaseSizeBeforeUpdate = columnRepository.findAll().size();
        column.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restColumnMockMvc
            .perform(
                put(ENTITY_API_URL_ID, column.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(column))
            )
            .andExpect(status().isBadRequest());

        // Validate the Column in the database
        List<Column> columnList = columnRepository.findAll();
        assertThat(columnList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchColumn() throws Exception {
        int databaseSizeBeforeUpdate = columnRepository.findAll().size();
        column.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restColumnMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(column))
            )
            .andExpect(status().isBadRequest());

        // Validate the Column in the database
        List<Column> columnList = columnRepository.findAll();
        assertThat(columnList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamColumn() throws Exception {
        int databaseSizeBeforeUpdate = columnRepository.findAll().size();
        column.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restColumnMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(column)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Column in the database
        List<Column> columnList = columnRepository.findAll();
        assertThat(columnList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateColumnWithPatch() throws Exception {
        // Initialize the database
        columnRepository.saveAndFlush(column);

        int databaseSizeBeforeUpdate = columnRepository.findAll().size();

        // Update the column using partial update
        Column partialUpdatedColumn = new Column();
        partialUpdatedColumn.setId(column.getId());

        restColumnMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedColumn.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedColumn))
            )
            .andExpect(status().isOk());

        // Validate the Column in the database
        List<Column> columnList = columnRepository.findAll();
        assertThat(columnList).hasSize(databaseSizeBeforeUpdate);
        Column testColumn = columnList.get(columnList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateColumnWithPatch() throws Exception {
        // Initialize the database
        columnRepository.saveAndFlush(column);

        int databaseSizeBeforeUpdate = columnRepository.findAll().size();

        // Update the column using partial update
        Column partialUpdatedColumn = new Column();
        partialUpdatedColumn.setId(column.getId());

        restColumnMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedColumn.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedColumn))
            )
            .andExpect(status().isOk());

        // Validate the Column in the database
        List<Column> columnList = columnRepository.findAll();
        assertThat(columnList).hasSize(databaseSizeBeforeUpdate);
        Column testColumn = columnList.get(columnList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingColumn() throws Exception {
        int databaseSizeBeforeUpdate = columnRepository.findAll().size();
        column.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restColumnMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, column.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(column))
            )
            .andExpect(status().isBadRequest());

        // Validate the Column in the database
        List<Column> columnList = columnRepository.findAll();
        assertThat(columnList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchColumn() throws Exception {
        int databaseSizeBeforeUpdate = columnRepository.findAll().size();
        column.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restColumnMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(column))
            )
            .andExpect(status().isBadRequest());

        // Validate the Column in the database
        List<Column> columnList = columnRepository.findAll();
        assertThat(columnList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamColumn() throws Exception {
        int databaseSizeBeforeUpdate = columnRepository.findAll().size();
        column.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restColumnMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(column)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Column in the database
        List<Column> columnList = columnRepository.findAll();
        assertThat(columnList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteColumn() throws Exception {
        // Initialize the database
        columnRepository.saveAndFlush(column);

        int databaseSizeBeforeDelete = columnRepository.findAll().size();

        // Delete the column
        restColumnMockMvc
            .perform(delete(ENTITY_API_URL_ID, column.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Column> columnList = columnRepository.findAll();
        assertThat(columnList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
