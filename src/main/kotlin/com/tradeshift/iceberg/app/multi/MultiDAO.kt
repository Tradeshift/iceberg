package com.tradeshift.iceberg.app.multi

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.tradeshift.iceberg.app.multi.dto.MultiDatum
import com.tradeshift.iceberg.app.multi.dto.MultiModel
import org.jdbi.v3.core.Jdbi
import org.jdbi.v3.core.kotlin.useHandleUnchecked
import org.jdbi.v3.core.kotlin.withHandleUnchecked
import java.sql.Timestamp
import java.util.*

class MultiDAO(
    private val jdbi: Jdbi
) {

    private val om = ObjectMapper()

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

    fun getData(username: String, modelId: String, from: Timestamp, to: Timestamp): List<MultiDatum> {
        return jdbi.withHandleUnchecked<List<MultiDatum>> {
            it.createQuery(
                "SELECT ts, correct, predictions from multi_data where " +
                        "multi_id = :modelId and " +
                        "multi_username = :username and " +
                        "ts between :from and :to " +
                        "order by ts"
            )
                .bind("modelId", modelId)
                .bind("username", username)
                .bind("from", from)
                .bind("to", to)
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
}
