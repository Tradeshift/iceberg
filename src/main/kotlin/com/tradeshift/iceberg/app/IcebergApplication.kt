package com.tradeshift.iceberg.app

import com.fasterxml.jackson.module.kotlin.KotlinModule
import com.tradeshift.iceberg.app.multi.MultiDAO
import com.tradeshift.iceberg.app.multi.MultiResource
import com.tradeshift.iceberg.app.multi.MultiService
import io.dropwizard.Application
import io.dropwizard.assets.AssetsBundle
import io.dropwizard.db.DataSourceFactory
import io.dropwizard.jdbi3.JdbiFactory
import io.dropwizard.migrations.MigrationsBundle
import io.dropwizard.setup.Bootstrap
import io.dropwizard.setup.Environment
import liquibase.Liquibase
import liquibase.database.jvm.JdbcConnection
import liquibase.resource.ClassLoaderResourceAccessor
import mu.KotlinLogging
import org.jdbi.v3.core.Jdbi
import org.jdbi.v3.core.kotlin.KotlinPlugin
import org.jdbi.v3.core.kotlin.withHandleUnchecked


private val logger = KotlinLogging.logger {}

class IcebergApplication : Application<IcebergConfiguration>() {

    override fun getName(): String {
        return "iceberg"
    }

    override fun initialize(bootstrap: Bootstrap<IcebergConfiguration>) {
        bootstrap.addBundle(object : MigrationsBundle<IcebergConfiguration>() {
            override fun getDataSourceFactory(configuration: IcebergConfiguration): DataSourceFactory {
                return configuration.database
            }

            override fun getMigrationsFileName(): String = "migrations.sql"
        })
        bootstrap.addBundle(AssetsBundle("/app", "/app", "index.html"))
    }

    override fun run(config: IcebergConfiguration, environment: Environment) {
        logger.info { environment.objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(config) }
        val jdbi = setupDatabase(environment, config)

        val multiDAO = MultiDAO(jdbi)
        val multiService = MultiService(multiDAO)
        val multiResource = MultiResource(multiService)

        environment.objectMapper.registerModule(KotlinModule())
        environment.jersey().register(multiResource)
    }

    private fun setupDatabase(environment: Environment, config: IcebergConfiguration): Jdbi {
        val factory = JdbiFactory()
        val jdbi = factory.build(environment, config.database, "db")!!
        jdbi.installPlugin(KotlinPlugin())

        jdbi.withHandleUnchecked {
            it.useTransaction<Exception> {
                Liquibase("migrations.sql", ClassLoaderResourceAccessor(), JdbcConnection(it.connection)).update("")
            }
        }
        return jdbi
    }

    companion object {
        @Throws(Exception::class)
        @JvmStatic
        fun main(args: Array<String>) {
            IcebergApplication().run(*args)
        }
    }

}

