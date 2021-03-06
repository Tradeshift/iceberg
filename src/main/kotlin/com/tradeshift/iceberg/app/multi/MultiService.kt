package com.tradeshift.iceberg.app.multi

import com.tradeshift.iceberg.app.multi.dto.*
import com.tradeshift.iceberg.core.ConfusionMatrix
import java.sql.Timestamp
import java.time.LocalDate

class MultiService(
    private val multiDAO: MultiDAO
) {
    fun addData(username: String, modelId: String, data: List<MultiDatum>) {
        val model = getModel(username, modelId)
        if (model == null) {
            addModel(username, modelId)
        }
        multiDAO.addData(username, modelId, data)
    }

    fun getModel(username: String, modelId: String): MultiModel? {
        return multiDAO.getModel(username, modelId)
    }

    fun addModel(username: String, modelId: String) {
        multiDAO.addModel(username, modelId)
    }

    fun getStats(username: String, modelId: String, from: LocalDate, to: LocalDate, limit: Int): MultiStatsResponse? {
        val model = multiDAO.getModel(username, modelId) ?: return null
        val data = multiDAO.getData(
            username,
            modelId,
            Timestamp.valueOf(from.atStartOfDay()),
            Timestamp.valueOf(to.plusDays(1).atStartOfDay()),
            limit
        )
        val stats = if (data.isEmpty()) {
            listOf<MultiStats>()
        } else {
            val stats = mutableListOf<MultiStats>()
            for (i in 0..100) {
                val threshold = i / 100.0
                val cm = ConfusionMatrix.from(data, threshold)
                stats.add(
                    MultiStats(
                        threshold,
                        cm.correct,
                        cm.correct95PercentCredibleInterval.toList(),
                        cm.error,
                        cm.error95PercentCredibleInterval.toList(),
                        cm.abstain,
                        cm.abstain95PercentCredibleInterval.toList()
                    )
                )
            }
            stats
        }
        return MultiStatsResponse(model, data.size, data.map { it.correct }.toSet().size, stats)
    }

    fun getModels(page: Int, username: String?, id: String?): PagedModels {
        return multiDAO.getModels(page, username, id)
    }

    fun getModelsForUser(username: String, page: Int): PagedModels {
        return multiDAO.getModelsForUser(username, page)
    }

    fun putModel(model: MultiModel) {
        val found = multiDAO.getModel(model.username, model.id)
        if (found == null) {
            multiDAO.addModel(model)
        } else {
            multiDAO.updateModel(model)
        }
    }

    fun deleteModel(username: String, modelId: String) {
        multiDAO.deleteModel(username, modelId)
    }

}

