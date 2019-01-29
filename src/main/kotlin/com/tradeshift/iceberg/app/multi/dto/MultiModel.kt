package com.tradeshift.iceberg.app.multi.dto

data class MultiModel(
    val username: String,
    val id: String,
    val threshold: Float,
    val errorCost: Float,
    val abstainCost: Float,
    val correctCost: Float
)
