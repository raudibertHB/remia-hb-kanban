package com.hb.remi.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Developer.
 */
@Entity
@Table(name = "developer")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Developer implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "developer")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "developer" }, allowSetters = true)
    private Set<Task> tasks = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Developer id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Developer name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Task> getTasks() {
        return this.tasks;
    }

    public Developer tasks(Set<Task> tasks) {
        this.setTasks(tasks);
        return this;
    }

    public Developer addTask(Task task) {
        this.tasks.add(task);
        task.setDeveloper(this);
        return this;
    }

    public Developer removeTask(Task task) {
        this.tasks.remove(task);
        task.setDeveloper(null);
        return this;
    }

    public void setTasks(Set<Task> tasks) {
        if (this.tasks != null) {
            this.tasks.forEach(i -> i.setDeveloper(null));
        }
        if (tasks != null) {
            tasks.forEach(i -> i.setDeveloper(this));
        }
        this.tasks = tasks;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Developer)) {
            return false;
        }
        return id != null && id.equals(((Developer) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Developer{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
