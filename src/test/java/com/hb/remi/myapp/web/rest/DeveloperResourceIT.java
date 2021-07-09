package com.hb.remi.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.hb.remi.myapp.IntegrationTest;
import com.hb.remi.myapp.domain.Developer;
import com.hb.remi.myapp.repository.DeveloperRepository;
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
 * Integration tests for the {@link DeveloperResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DeveloperResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/developers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DeveloperRepository developerRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDeveloperMockMvc;

    private Developer developer;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Developer createEntity(EntityManager em) {
        Developer developer = new Developer().name(DEFAULT_NAME);
        return developer;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Developer createUpdatedEntity(EntityManager em) {
        Developer developer = new Developer().name(UPDATED_NAME);
        return developer;
    }

    @BeforeEach
    public void initTest() {
        developer = createEntity(em);
    }

    @Test
    @Transactional
    void createDeveloper() throws Exception {
        int databaseSizeBeforeCreate = developerRepository.findAll().size();
        // Create the Developer
        restDeveloperMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(developer)))
            .andExpect(status().isCreated());

        // Validate the Developer in the database
        List<Developer> developerList = developerRepository.findAll();
        assertThat(developerList).hasSize(databaseSizeBeforeCreate + 1);
        Developer testDeveloper = developerList.get(developerList.size() - 1);
        assertThat(testDeveloper.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createDeveloperWithExistingId() throws Exception {
        // Create the Developer with an existing ID
        developer.setId(1L);

        int databaseSizeBeforeCreate = developerRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDeveloperMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(developer)))
            .andExpect(status().isBadRequest());

        // Validate the Developer in the database
        List<Developer> developerList = developerRepository.findAll();
        assertThat(developerList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDevelopers() throws Exception {
        // Initialize the database
        developerRepository.saveAndFlush(developer);

        // Get all the developerList
        restDeveloperMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(developer.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getDeveloper() throws Exception {
        // Initialize the database
        developerRepository.saveAndFlush(developer);

        // Get the developer
        restDeveloperMockMvc
            .perform(get(ENTITY_API_URL_ID, developer.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(developer.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingDeveloper() throws Exception {
        // Get the developer
        restDeveloperMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewDeveloper() throws Exception {
        // Initialize the database
        developerRepository.saveAndFlush(developer);

        int databaseSizeBeforeUpdate = developerRepository.findAll().size();

        // Update the developer
        Developer updatedDeveloper = developerRepository.findById(developer.getId()).get();
        // Disconnect from session so that the updates on updatedDeveloper are not directly saved in db
        em.detach(updatedDeveloper);
        updatedDeveloper.name(UPDATED_NAME);

        restDeveloperMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDeveloper.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDeveloper))
            )
            .andExpect(status().isOk());

        // Validate the Developer in the database
        List<Developer> developerList = developerRepository.findAll();
        assertThat(developerList).hasSize(databaseSizeBeforeUpdate);
        Developer testDeveloper = developerList.get(developerList.size() - 1);
        assertThat(testDeveloper.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingDeveloper() throws Exception {
        int databaseSizeBeforeUpdate = developerRepository.findAll().size();
        developer.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDeveloperMockMvc
            .perform(
                put(ENTITY_API_URL_ID, developer.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(developer))
            )
            .andExpect(status().isBadRequest());

        // Validate the Developer in the database
        List<Developer> developerList = developerRepository.findAll();
        assertThat(developerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDeveloper() throws Exception {
        int databaseSizeBeforeUpdate = developerRepository.findAll().size();
        developer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDeveloperMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(developer))
            )
            .andExpect(status().isBadRequest());

        // Validate the Developer in the database
        List<Developer> developerList = developerRepository.findAll();
        assertThat(developerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDeveloper() throws Exception {
        int databaseSizeBeforeUpdate = developerRepository.findAll().size();
        developer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDeveloperMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(developer)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Developer in the database
        List<Developer> developerList = developerRepository.findAll();
        assertThat(developerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDeveloperWithPatch() throws Exception {
        // Initialize the database
        developerRepository.saveAndFlush(developer);

        int databaseSizeBeforeUpdate = developerRepository.findAll().size();

        // Update the developer using partial update
        Developer partialUpdatedDeveloper = new Developer();
        partialUpdatedDeveloper.setId(developer.getId());

        restDeveloperMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDeveloper.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDeveloper))
            )
            .andExpect(status().isOk());

        // Validate the Developer in the database
        List<Developer> developerList = developerRepository.findAll();
        assertThat(developerList).hasSize(databaseSizeBeforeUpdate);
        Developer testDeveloper = developerList.get(developerList.size() - 1);
        assertThat(testDeveloper.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void fullUpdateDeveloperWithPatch() throws Exception {
        // Initialize the database
        developerRepository.saveAndFlush(developer);

        int databaseSizeBeforeUpdate = developerRepository.findAll().size();

        // Update the developer using partial update
        Developer partialUpdatedDeveloper = new Developer();
        partialUpdatedDeveloper.setId(developer.getId());

        partialUpdatedDeveloper.name(UPDATED_NAME);

        restDeveloperMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDeveloper.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDeveloper))
            )
            .andExpect(status().isOk());

        // Validate the Developer in the database
        List<Developer> developerList = developerRepository.findAll();
        assertThat(developerList).hasSize(databaseSizeBeforeUpdate);
        Developer testDeveloper = developerList.get(developerList.size() - 1);
        assertThat(testDeveloper.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingDeveloper() throws Exception {
        int databaseSizeBeforeUpdate = developerRepository.findAll().size();
        developer.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDeveloperMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, developer.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(developer))
            )
            .andExpect(status().isBadRequest());

        // Validate the Developer in the database
        List<Developer> developerList = developerRepository.findAll();
        assertThat(developerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDeveloper() throws Exception {
        int databaseSizeBeforeUpdate = developerRepository.findAll().size();
        developer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDeveloperMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(developer))
            )
            .andExpect(status().isBadRequest());

        // Validate the Developer in the database
        List<Developer> developerList = developerRepository.findAll();
        assertThat(developerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDeveloper() throws Exception {
        int databaseSizeBeforeUpdate = developerRepository.findAll().size();
        developer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDeveloperMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(developer))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Developer in the database
        List<Developer> developerList = developerRepository.findAll();
        assertThat(developerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDeveloper() throws Exception {
        // Initialize the database
        developerRepository.saveAndFlush(developer);

        int databaseSizeBeforeDelete = developerRepository.findAll().size();

        // Delete the developer
        restDeveloperMockMvc
            .perform(delete(ENTITY_API_URL_ID, developer.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Developer> developerList = developerRepository.findAll();
        assertThat(developerList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
