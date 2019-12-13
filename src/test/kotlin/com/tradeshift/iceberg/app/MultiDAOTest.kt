package com.tradeshift.iceberg.app

import com.tradeshift.iceberg.app.multi.MultiDAO
import com.tradeshift.iceberg.app.multi.dto.MultiDatum
import com.tradeshift.iceberg.app.multi.dto.MultiModel
import liquibase.Liquibase
import liquibase.database.jvm.JdbcConnection
import liquibase.resource.ClassLoaderResourceAccessor
import org.jdbi.v3.core.Jdbi
import org.jdbi.v3.core.kotlin.KotlinPlugin
import org.jdbi.v3.core.statement.UnableToExecuteStatementException
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test
import java.lang.Math.random
import java.sql.DriverManager
import java.sql.Timestamp
import java.time.Instant
import java.util.*


class MultiDAOTest {

    var jdbi: Jdbi? = null

    @Before
    fun setup() {
        val connection = DriverManager.getConnection("jdbc:h2:mem:")
        Liquibase("migrations.sql", ClassLoaderResourceAccessor(), JdbcConnection(connection)).update("")
        jdbi = Jdbi.create(connection).installPlugin(KotlinPlugin())
    }


    @Test
    fun test_add_and_get_model() {
        val dao = MultiDAO(jdbi!!)
        val username = "baz"
        val modelId = "foo"
        assertNull(dao.getModel(username, modelId))

        dao.addModel(username, modelId)

        val expected = MultiModel(username, modelId, 0.0f, 5.0f, 1.0f, 0.0f)
        val actual = dao.getModel(username, modelId)
        assertEquals(expected, actual)
    }

    @Test
    fun test_add_and_get_data() {
        val dao = MultiDAO(jdbi!!)
        val username = "baz"
        val modelId = "foo"

        val actual = dao.getData(username, modelId, Timestamp(0), Timestamp.from(Instant.now()), 1000)
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
            dao.addData(username, modelId, data)
            fail("Expected UnableToExecuteStatementException since no model exists, so violating foreign key")
        } catch (e: UnableToExecuteStatementException) {
        }

        dao.addModel(username, modelId)
        dao.addData(username, modelId, data)

        val a2 = dao.getData(username, modelId, Timestamp(0), Timestamp.from(Instant.now()), 1000)
        assertEquals(data.toSet(), a2.toSet())

        val a3 = dao.getData(
            username,
            modelId,
            Timestamp.from(d1.ts.toInstant().plusSeconds(5)),
            Timestamp.from(Instant.now()),
            1000
        )
        assertEquals(setOf(d2), a3.toSet())

        val a4 = dao.getData(
            username,
            modelId,
            Timestamp(0),
            Timestamp.from(d2.ts.toInstant().minusSeconds(5)),
            1000
        )
        assertEquals(setOf(d1), a4.toSet())

        val seen = mutableSetOf<MultiDatum>()
        for (i in 1..100) {
            val a5 = dao.getData(
                username,
                modelId,
                Timestamp(0),
                Timestamp.from(d2.ts.toInstant().plusSeconds(5)),
                1
            )
            assertEquals(1, a5.size)
            seen.add(a5[0])
        }
        assertEquals(setOf(d1, d2), seen) //less than <1e-30 probability of failing if random is random.
    }

    @Test
    fun test_get_all_models() {
        val dao = MultiDAO(jdbi!!)
        val models = (0..149).map {
            MultiModel(
                UUID.randomUUID().toString(),
                UUID.randomUUID().toString(),
                0.0f,
                0.0f,
                0.0f,
                0.0f
            )
        }
        models.forEach { dao.addModel(it) }
        val sorted = models.sortedBy { it.username + it.id }
        val p0 = dao.getModels(0)
        assertEquals(p0.numPages, 2)
        assertEquals(sorted.subList(0, 100), p0.models)
        assertEquals(sorted.subList(100, 150), dao.getModels(1).models)
        assertTrue(dao.getModels(2).models.isEmpty())
    }

    @Test
    fun test_search_for_models() {
        val dao = MultiDAO(jdbi!!)

        val m1 = MultiModel("user-bar", "model-bar-1", 0.0f, 0.0f, 0.0f, 0.0f)
        val m2 = MultiModel("user-bar", "model-bar-2", 0.0f, 0.0f, 0.0f, 0.0f)
        val m3 = MultiModel("user-foo", "model-foo-1", 0.0f, 0.0f, 0.0f, 0.0f)
        val m4 = MultiModel("user-foo", "model-foo-2", 0.0f, 0.0f, 0.0f, 0.0f)
        dao.addModel(m1)
        dao.addModel(m2)
        dao.addModel(m3)
        dao.addModel(m4)

        assertEquals(listOf(m1, m2, m3, m4), dao.getModels(0).models)
        assertEquals(listOf<MultiModel>(), dao.getModels(0, "zap").models)
        assertEquals(listOf(m1, m2), dao.getModels(0, "user-b").models)
        assertEquals(listOf(m1, m2), dao.getModels(0, "user-bar").models)
        assertEquals(listOf(m1, m2), dao.getModels(0, "user-bar", "model").models)
        assertEquals(listOf(m1), dao.getModels(0, "user-bar", "model-bar-1").models)
        assertEquals(listOf(m2), dao.getModels(0, "user-bar", "model-bar-2").models)
        assertEquals(listOf(m1, m2, m3, m4), dao.getModels(0, "user", "model").models)
        assertEquals(listOf(m3, m4), dao.getModels(0, "user-fo", "model").models)
        assertEquals(listOf<MultiModel>(), dao.getModels(0, "user-ba", "model-foo").models)
        assertEquals(listOf(m4), dao.getModels(0, "user-fo", "model-foo-2").models)
    }

    @Test
    fun update_model() {
        val dao = MultiDAO(jdbi!!)
        fun rf() = random().toFloat()
        dao.addModel("foo", "bar")
        val expected = MultiModel("foo", "bar", rf(), rf(), rf(), rf())
        dao.updateModel(expected)
        assertEquals(expected, dao.getModel("foo", "bar"))
    }


    @Test
    fun test_get_user_models() {
        val dao = MultiDAO(jdbi!!)
        val models = (0..149).map {
            MultiModel(
                "foo",
                UUID.randomUUID().toString(),
                0.0f,
                0.0f,
                0.0f,
                0.0f
            )
        }
        models.forEach { dao.addModel(it) }
        val sorted = models.sortedBy { it.username + it.id }
        val p0 = dao.getModelsForUser("foo", 0)
        assertEquals(p0.numPages, 2)
        assertEquals(sorted.subList(0, 100), p0.models)
        assertEquals(sorted.subList(100, 150), dao.getModelsForUser("foo", 1).models)
        assertTrue(dao.getModelsForUser("foo", 2).models.isEmpty())
    }

    @Test
    fun delete_model() {
        val dao = MultiDAO(jdbi!!)
        dao.addModel("foo", "bar")
        assertNotNull(dao.getModel("foo", "bar"))
        dao.deleteModel("foo", "bar")
        assertNull(dao.getModel("foo", "bar"))
    }
}
