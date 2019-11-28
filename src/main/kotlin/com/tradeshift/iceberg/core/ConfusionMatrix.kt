package com.tradeshift.iceberg.core

import com.google.common.collect.HashBasedTable
import com.google.common.collect.ImmutableTable
import com.tradeshift.iceberg.app.multi.dto.MultiDatum
import org.apache.commons.math3.distribution.BetaDistribution

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
        if (nTotal == 0) Double.NaN else nCorrect.toDouble() / nTotal
    }

    val correct95PercentCredibleInterval: Pair<Double, Double> by lazy {
        if (nTotal == 0) Pair(Double.NaN, Double.NaN) else binomial95PercentCredibleInterval(nCorrect, nTotal)
    }

    val error by lazy {
        if (nTotal == 0) Double.NaN else nError.toDouble() / nTotal
    }

    val error95PercentCredibleInterval: Pair<Double, Double> by lazy {
        if (nTotal == 0) Pair(Double.NaN, Double.NaN) else binomial95PercentCredibleInterval(nError, nTotal)
    }

    val abstain by lazy {
        if (nTotal == 0) Double.NaN else nAbstain.toDouble() / nTotal
    }

    val abstain95PercentCredibleInterval: Pair<Double, Double> by lazy {
        if (nTotal == 0) Pair(Double.NaN, Double.NaN) else binomial95PercentCredibleInterval(nAbstain, nTotal)
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

        /**
         * The 95 percent credible interval (2.5% to 97.5%) of the rate of success in a binomial distribution, from which
         * you've observed #successes out of #total trials under a uniform beta(1,1) prior on the rate of success.
         */
        fun binomial95PercentCredibleInterval(successes: Int, total: Int): Pair<Double, Double> {
            val alpha = successes + 1
            val beta = (total - successes) + 1
            val b = BetaDistribution(alpha.toDouble(), beta.toDouble())

            val p025 = b.inverseCumulativeProbability(0.025)
            val p975 = b.inverseCumulativeProbability(0.975)

            return Pair(p025, p975)
        }

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
