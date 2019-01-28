package com.tradeshift.iceberg.app.multi

import com.tradeshift.iceberg.app.multi.dto.MultiDatum
import com.tradeshift.iceberg.app.multi.dto.MultiModel
import com.tradeshift.iceberg.app.multi.dto.MultiStats
import com.tradeshift.iceberg.app.multi.dto.MultiStatsResponse
import com.tradeshift.iceberg.core.ConfusionMatrix
import java.sql.Timestamp
import java.time.LocalDate
import java.util.*

class MultiService(
    private val multiDAO: MultiDAO
) {
    fun addData(tenantId: UUID, modelId: String, data: List<MultiDatum>) {
        multiDAO.addData(tenantId, modelId, data)
    }

    fun getModel(tenantId: UUID, modelId: String): MultiModel? {
        return multiDAO.getModel(tenantId, modelId)
    }

    fun addModel(tenantId: UUID, modelId: String) {
        multiDAO.addModel(tenantId, modelId)
    }

    fun getStats(tenantId: UUID, modelId: String, from: LocalDate, to: LocalDate): MultiStatsResponse? {
        val model = multiDAO.getModel(tenantId, modelId) ?: return null
        val data = multiDAO.getData(
            tenantId,
            modelId,
            Timestamp.valueOf(from.atStartOfDay()),
            Timestamp.valueOf(to.atStartOfDay())
        )
        val stats = if (data.isEmpty()) {
            listOf<MultiStats>()
        } else {
            val stats = mutableListOf<MultiStats>()
            for (i in 0..100) {
                val threshold = i / 100.0
                val cm = ConfusionMatrix.from(data, threshold)
                stats.add(MultiStats(threshold, cm.correct, cm.error, cm.abstain))
            }
            stats
        }
        return MultiStatsResponse(model, data.size, data.map { it.correct }.toSet().size, stats)
    }

}
