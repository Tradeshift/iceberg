package com.tradeshift.iceberg.app

import org.jdbi.v3.core.Jdbi
import org.junit.Test

import org.junit.Assert.*
import java.util.*
import com.opentable.db.postgres.embedded.LiquibasePreparer
import com.opentable.db.postgres.junit.EmbeddedPostgresRules
import com.tradeshift.iceberg.app.multi.MultiDAO
import com.tradeshift.iceberg.app.multi.dto.MultiDatum
import com.tradeshift.iceberg.app.multi.dto.MultiModel
import org.jdbi.v3.core.statement.UnableToExecuteStatementException
import org.junit.Rule
import java.sql.Timestamp
import java.time.Instant


class MultiDAOTest {

    @Rule
    @JvmField
    val db = EmbeddedPostgresRules.preparedDatabase(LiquibasePreparer.forClasspathLocation("migrations.sql"))

    @Test
    fun test_add_and_get_model() {
        val dao = MultiDAO(Jdbi.create(db.testDatabase))
        val tenantId = UUID.randomUUID()
        val modelId = "foo"
        assertNull(dao.getModel(tenantId, modelId))

        dao.addModel(tenantId, modelId)

        val expected = MultiModel(tenantId, modelId, 0.0f, 5.0f, 1.0f, 0.0f)
        val actual = dao.getModel(tenantId, modelId)
        assertEquals(expected, actual)
    }

    @Test
    fun test_add_and_get_data() {
        val dao = MultiDAO(Jdbi.create(db.testDatabase))
        val tenantId = UUID.randomUUID()
        val modelId = "foo"

        val actual = dao.getData(tenantId, modelId, Timestamp(0), Timestamp.from(Instant.now()))
        assertTrue("Expected no data", actual.isEmpty())

        val d1 = MultiDatum(
            Timestamp.from(Instant.now().minusSeconds(20)),
            "foo",
            mapOf("foo" to 0.43, "bar" to 0.57)
        )
        val d2 = MultiDatum(
            Timestamp.from(Instant.now().minusSeconds(10)),
            "bar",
            mapOf("foo" to 0.53, "bar" to 0.47)
        )
        val data = listOf(d1, d2)
        try {
            dao.addData(tenantId, modelId, data)
            fail("Expected UnableToExecuteStatementException since no model exists, so violating foreign key")
        } catch (e: UnableToExecuteStatementException) {
        }

        dao.addModel(tenantId, modelId)
        dao.addData(tenantId, modelId, data)

        val a2 = dao.getData(tenantId, modelId, Timestamp(0), Timestamp.from(Instant.now()))
        assertEquals(data, a2)

        val a3 = dao.getData(
            tenantId,
            modelId,
            Timestamp.from(d1.ts.toInstant().plusSeconds(5)),
            Timestamp.from(Instant.now())
        )
        assertEquals(listOf(d2), a3)

        val a4 = dao.getData(
            tenantId,
            modelId,
            Timestamp(0),
            Timestamp.from(d2.ts.toInstant().minusSeconds(5))
        )
        assertEquals(listOf(d1), a4)
    }
}