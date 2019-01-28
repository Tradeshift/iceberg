package com.tradeshift.iceberg.app.multi.dto

import java.util.*

data class MultiModel(
    val tenantId: UUID,
    val id: String,
    val threshold: Float,
    val errorCost: Float,
    val abstainCost: Float,
    val correctCost: Float
)
