package com.tradeshift.iceberg.core

import com.google.common.collect.ImmutableTable
import com.tradeshift.iceberg.app.multi.dto.MultiDatum
import org.junit.Test

import org.junit.Assert.*
import java.sql.Timestamp

class ConfusionMatrixTest {

    @Test
    fun test_empty_matrix() {
        val cm = ConfusionMatrix(ImmutableTable.of())
        assertEquals(0, cm.nTotal)
        assertEquals(0, cm.nCorrect)
        assertEquals(0, cm.nError)
        assertEquals(0, cm.nAbstain)

        assertTrue(cm.correct.isNaN())
        assertTrue(cm.error.isNaN())
        assertTrue(cm.abstain.isNaN())
        assertTrue(cm.recall.isNaN())
        assertTrue(cm.precision.isNaN())
    }

    @Test
    fun test_full_matrix() {
        val cm = ConfusionMatrix(
            ImmutableTable.builder<String, String, Int>()
                .put("foo", "foo", 5)
                .put("foo", "bar", 1)
                .put("bar", "foo", 3)
                .put("bar", "bar", 7)
                .build()
        )
        val nTotal = 5 + 1 + 3 + 7
        val nCorrect = 5 + 7
        val nError = 1 + 3
        assertEquals(nTotal, cm.nTotal)
        assertEquals(nCorrect, cm.nCorrect)
        assertEquals(nError, cm.nError)
        assertEquals(0, cm.nAbstain)

        assertEquals(nCorrect.toDouble() / nTotal, cm.correct, 0.0)
        assertEquals(nError.toDouble() / nTotal, cm.error, 0.0)
        assertEquals(0.0, cm.abstain, 0.0)
        assertEquals(((5.0 / 6.0) + (7.0 / 10.0)) / 2, cm.recall, 0.0)
        assertEquals(((5.0 / 8.0) + (7.0 / 8.0)) / 2, cm.precision, 0.0)
    }

    @Test
    fun test_sparse_matrix() {
        val cm = ConfusionMatrix(
            ImmutableTable.builder<String, String, Int>()
                .put("foo", "bar", 1)
                .put("bar", "bar", 7)
                .build()
        )
        val nTotal = 1 + 7
        val nCorrect = 7
        val nError = 1
        assertEquals(nTotal, cm.nTotal)
        assertEquals(nCorrect, cm.nCorrect)
        assertEquals(nError, cm.nError)
        assertEquals(0, cm.nAbstain)

        assertEquals(nCorrect.toDouble() / nTotal, cm.correct, 0.0)
        assertEquals(nError.toDouble() / nTotal, cm.error, 0.0)
        assertEquals(0.0, cm.abstain, 0.0)
        assertEquals(((0.0 / 1.0) + (7.0 / 7.0)) / 2, cm.recall, 0.0)
        assertEquals((7.0 / 8.0), cm.precision, 0.0)
    }

    @Test
    fun test_classes_with_no_correct() {
        val cm = ConfusionMatrix(
            ImmutableTable.builder<String, String, Int>()
                .put("bar", "foo", 1)
                .put("bar", "bar", 7)
                .build()
        )

        assertEquals(7.0 / 8.0, cm.recall, 0.0)
        assertEquals((0.0 / 1.0 + 7.0 / 7.0) / 2, cm.precision, 0.0)
    }

    @Test
    fun test_from_multi_data() {
        val cm = ConfusionMatrix.from(
            listOf(
                MultiDatum(
                    Timestamp(0),
                    "foo",
                    mapOf("foo" to 0.85, "bar" to 0.15)
                ),
                MultiDatum(
                    Timestamp(0),
                    "foo",
                    mapOf("foo" to 0.15, "bar" to 0.85)
                ),
                MultiDatum(
                    Timestamp(0),
                    "foo",
                    mapOf("foo" to 0.65, "bar" to 0.35)
                ),
                MultiDatum(
                    Timestamp(0),
                    "foo",
                    mapOf("foo" to 0.55, "bar" to 0.45)
                ),
                MultiDatum(
                    Timestamp(0),
                    "bar",
                    mapOf("foo" to 0.25, "bar" to 0.75)
                )
            ),
            0.6
        )
        assertEquals(2, cm.get("foo", "foo"))
        assertEquals(1, cm.get("foo", "bar"))
        assertEquals(1, cm.get("foo", ConfusionMatrix.ABSTAIN))
        assertEquals(1, cm.get("bar", "bar"))
        assertEquals(0, cm.get("bar", "foo"))
        assertEquals(0, cm.get("bar", ConfusionMatrix.ABSTAIN))
    }


}