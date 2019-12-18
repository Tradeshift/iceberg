package com.tradeshift.iceberg.app.multi.dto

data class PagedModels(
    val page: Int,
    val numPages: Int,
    val models: List<MultiModel>
)
