package com.tradeshift.iceberg.app.multi

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.tradeshift.iceberg.app.multi.dto.MultiDatum
import com.tradeshift.iceberg.app.multi.dto.MultiModel
import com.tradeshift.iceberg.app.multi.dto.PagedModels
import org.jdbi.v3.core.Jdbi
import org.jdbi.v3.core.kotlin.mapTo
import org.jdbi.v3.core.kotlin.useHandleUnchecked
import org.jdbi.v3.core.kotlin.withHandleUnchecked
import java.sql.Timestamp
import kotlin.math.ceil

class MultiDAO(
    private val jdbi: Jdbi
) {
    private val om = ObjectMapper()
    private val pageSize = 100

    fun getModel(username: String, modelId: String): MultiModel? {
        return jdbi.withHandleUnchecked {
            it.createQuery("SELECT * from multi where username = :username and id = :modelId")
                .bind("username", username)
                .bind("modelId", modelId)
                .map { rs, ctx ->
                    MultiModel(
                        rs.getString("username"),
                        rs.getString("id"),
                        rs.getFloat("threshold"),
                        rs.getFloat("error_cost"),
                        rs.getFloat("abstain_cost"),
                        rs.getFloat("correct_cost")
                    )
                }
                .findFirst()
                .orElse(null)
        }
    }

    fun addModel(username: String, modelId: String) {
        jdbi.useHandleUnchecked {
            it.createUpdate("INSERT into multi (username, id) values (:username, :modelId)")
                .bind("username", username)
                .bind("modelId", modelId)
                .execute()
        }
    }

    fun addModel(model: MultiModel) {
        jdbi.useHandleUnchecked {
            it.createUpdate("INSERT into multi (username, id, threshold, error_cost, abstain_cost, correct_cost) values (:username, :id, :threshold, :errorCost, :abstainCost, :correctCost)")
                .bindBean(model)
                .execute()
        }
    }

    fun addData(username: String, modelId: String, data: List<MultiDatum>) {
        jdbi.useHandleUnchecked {
            val b =
                it.prepareBatch("INSERT into multi_data (multi_username, multi_id, ts, correct, predictions) values (:username, :modelId, :ts, :correct, :predictions)")
            for (datum in data) {
                b.bind("username", username)
                    .bind("modelId", modelId)
                    .bind("ts", datum.ts)
                    .bind("correct", datum.correct)
                    .bind("predictions", om.writeValueAsBytes(datum.predictions))
                    .add()
            }
            b.execute()
        }
    }

    fun getData(username: String, modelId: String, from: Timestamp, to: Timestamp, limit: Int): List<MultiDatum> {
        return jdbi.withHandleUnchecked<List<MultiDatum>> {
            it.createQuery(
                "SELECT ts, correct, predictions from multi_data where " +
                        "multi_id = :modelId and " +
                        "multi_username = :username and " +
                        ":from <= ts and ts <= :to " +
                        "order by random() " +
                        "limit :limit"
            )
                .bind("modelId", modelId)
                .bind("username", username)
                .bind("from", from)
                .bind("to", to)
                .bind("limit", limit)
                .map { rs, ctx ->
                    MultiDatum(
                        rs.getTimestamp("ts"),
                        rs.getString("correct"),
                        om.readValue(
                            rs.getBytes("predictions"),
                            object : TypeReference<Map<String, Double>>() {})
                    )
                }
                .list()
        }
    }

    fun getModels(page: Int, username: String? = null, id: String? = null): PagedModels {
        val conditions = mutableListOf<String>()
        if (username != null) {
            conditions.add("username like :username")
        }
        if (id != null) {
            conditions.add("id like :id")
        }

        val where = if (conditions.isNotEmpty()) {
            "where " + conditions.joinToString(" and ")
        } else {
            ""
        }
        return jdbi.withHandleUnchecked {
            var cq = it.createQuery("SELECT count(*) from multi $where")
            if (username != null) {
                cq = cq.bind("username", "$username%")
            }
            if (id != null) {
                cq = cq.bind("id", "$id%")
            }
            val total = cq.mapTo<Int>().findOnly()

            var q = it.createQuery("SELECT * from multi $where order by username, id limit :pageSize offset :offset")
                .bind("pageSize", pageSize)
                .bind("offset", page * pageSize)

            if (username != null) {
                q = q.bind("username", "$username%")
            }
            if (id != null) {
                q = q.bind("id", "$id%")
            }

            val models = q.mapTo<MultiModel>().list()

            PagedModels(page, ceil(total.toDouble() / pageSize).toInt(), models)
        }
    }

    fun getModelsForUser(username: String, page: Int): PagedModels {
        return jdbi.withHandleUnchecked {
            val models =
                it.createQuery("SELECT * from multi where username = :username order by id limit :pageSize offset :offset")
                    .bind("pageSize", pageSize)
                    .bind("offset", page * pageSize)
                    .bind("username", username)
                    .mapTo<MultiModel>()
                    .list()

            val total = it.createQuery("SELECT count(*) from multi where username = :username")
                .bind("username", username)
                .mapTo<Int>()
                .findOnly()

            PagedModels(page, ceil(total.toDouble() / pageSize).toInt(), models)
        }
    }

    fun updateModel(model: MultiModel) {
        jdbi.useHandleUnchecked {
            it.createUpdate("UPDATE multi set threshold = :threshold, error_cost = :errorCost, abstain_cost = :abstainCost, correct_cost = :correctCost WHERE username = :username AND id = :id")
                .bindBean(model)
                .execute()
        }
    }

    fun deleteModel(username: String, modelId: String) {
        jdbi.useHandleUnchecked {
            it.createUpdate("DELETE from multi WHERE username = :username AND id = :modelId")
                .bind("username", username)
                .bind("modelId", modelId)
                .execute()
        }
    }
}
