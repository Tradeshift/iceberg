package com.tradeshift.iceberg.app.multi.dto

data class MultiStats(
    val threshold: Double,
    val correct: Double,
    val correctCredibleInterval: List<Double>,
    val error: Double,
    val errorCredibleInterval: List<Double>,
    val abstain: Double,
    val abstainCredibleInterval: List<Double>
)
