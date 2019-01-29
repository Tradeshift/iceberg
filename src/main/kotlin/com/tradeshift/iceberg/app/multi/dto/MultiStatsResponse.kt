package com.tradeshift.iceberg.app.multi.dto


data class MultiStatsResponse(
    val model: MultiModel,
    val samples: Int,
    val outcomes: Int,
    val stats: List<MultiStats>
)