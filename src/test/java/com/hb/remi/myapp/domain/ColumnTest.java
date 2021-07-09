package com.hb.remi.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.hb.remi.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ColumnTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Column.class);
        Column column1 = new Column();
        column1.setId(1L);
        Column column2 = new Column();
        column2.setId(column1.getId());
        assertThat(column1).isEqualTo(column2);
        column2.setId(2L);
        assertThat(column1).isNotEqualTo(column2);
        column1.setId(null);
        assertThat(column1).isNotEqualTo(column2);
    }
}
