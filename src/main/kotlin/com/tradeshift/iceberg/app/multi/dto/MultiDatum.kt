package com.tradeshift.iceberg.app.multi.dto

import java.sql.Timestamp

data class MultiDatum(
    val ts: Timestamp,
    val correct: String,
    val predictions: Map<String, Double>
)