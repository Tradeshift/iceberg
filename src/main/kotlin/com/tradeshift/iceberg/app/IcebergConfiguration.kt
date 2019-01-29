package com.tradeshift.iceberg.app

import io.dropwizard.Configuration
import io.dropwizard.db.DataSourceFactory
import javax.validation.Valid
import javax.validation.constraints.NotNull


class IcebergConfiguration : Configuration() {
    @Valid
    @NotNull
    val database = DataSourceFactory()

}