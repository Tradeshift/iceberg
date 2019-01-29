package com.tradeshift.iceberg.core

import com.google.common.collect.HashBasedTable
import com.google.common.collect.ImmutableTable
import com.tradeshift.iceberg.app.multi.dto.MultiDatum

class ConfusionMatrix(
    private val matrix: ImmutableTable<String, String, Int>
) {

    val nTotal by lazy { matrix.values().sum() }

    val nCorrect by lazy {
        matrix.rowKeySet().map { matrix.get(it, it) ?: 0 }.sum()
    }

    val nAbstain by lazy {
        matrix.column(ABSTAIN).values.sum()
    }

    val nError by lazy {
        (nTotal - nCorrect - nAbstain)
    }

    val correct by lazy {
        if (nTotal == 0) Double.NaN
        nCorrect.toDouble() / nTotal
    }

    val error by lazy {
        if (nTotal == 0) Double.NaN
        nError.toDouble() / nTotal
    }

    val abstain by lazy {
        if (nTotal == 0) Double.NaN
        nAbstain.toDouble() / nTotal
    }

    val recall by lazy {
        //TODO(rbp): figure out how to compute precision/recall/f1
        matrix.rowMap().map { (actual, predicted) ->
            (predicted[actual] ?: 0).toDouble() / predicted.values.sum()
        }.toDoubleArray().average()
    }

    val precision by lazy {
        //TODO(rbp): figure out how to compute precision/recall/f1
        matrix.columnMap().map { (predicted, actual) ->
            (actual[predicted] ?: 0).toDouble() / actual.values.sum()
        }.toDoubleArray().average()
    }

    fun get(actual: String, predicted: String): Int {
        return matrix.get(actual, predicted) ?: 0
    }

    companion object {
        const val ABSTAIN: String = "ABSTAIN"

        fun from(data: List<MultiDatum>, threshold: Double): ConfusionMatrix {
            val table = HashBasedTable.create<String, String, Int>()
            for (datum in data) {
                val max = datum.predictions.maxBy { it.value }?.toPair()
                val actual = if (max == null || max.second < threshold) ABSTAIN else max.first
                val correct = datum.correct
                val current = table.get(correct, actual) ?: 0
                table.put(correct, actual, current + 1)
            }
            return ConfusionMatrix(ImmutableTable.copyOf(table))
        }
    }

}