package com.tradeshift.iceberg.app.multi

import com.tradeshift.iceberg.app.multi.dto.MultiDatum
import com.tradeshift.iceberg.app.multi.dto.MultiModel
import com.tradeshift.iceberg.app.multi.dto.MultiStats
import com.tradeshift.iceberg.app.multi.dto.MultiStatsResponse
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
            Timestamp.valueOf(to.atStartOfDay()),
            limit
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

    fun getModels(page: Int): List<MultiModel> {
        return multiDAO.getModels(page)
    }

    fun getModelsForUser(username: String, page: Int): List<MultiModel> {
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
