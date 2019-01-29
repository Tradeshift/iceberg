package com.tradeshift.iceberg.app.multi.dto

data class MultiStats(
    val threshold: Double,
    val correct: Double,
    val error: Double,
    val abstain: Double
)