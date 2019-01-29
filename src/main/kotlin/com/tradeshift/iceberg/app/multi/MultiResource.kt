package com.tradeshift.iceberg.app.multi

import com.tradeshift.iceberg.app.multi.dto.MultiDatum
import com.tradeshift.iceberg.app.multi.dto.MultiStatsResponse
import io.dropwizard.jersey.jsr310.LocalDateParam
import java.time.LocalDate
import java.util.*
import javax.validation.constraints.NotNull
import javax.ws.rs.*
import javax.ws.rs.core.MediaType
import javax.ws.rs.core.Response
import javax.ws.rs.core.Response.Status.NOT_FOUND


@Path("multi")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
class MultiResource(
    private val service: MultiService
) {

    @POST
    @Path("/{id}/data")
    fun postData(
        @NotNull @HeaderParam("X-Tradeshift-TenantId") tenantId: UUID,
        @NotNull @PathParam("id") modelId: String,
        data: List<MultiDatum>
    ) {
        val model = service.getModel(tenantId, modelId)
        if (model == null) {
            service.addModel(tenantId, modelId)
        }
        service.addData(tenantId, modelId, data)
    }

    @GET
    @Path("/{id}/stats")
    fun getStats(
        @NotNull @HeaderParam("X-Tradeshift-TenantId") tenantId: UUID,
        @NotNull @PathParam("id") modelId: String,
        @QueryParam("from") from: LocalDateParam,
        @QueryParam("to") to: LocalDateParam
    ): Response {
        val stats = service.getStats(tenantId, modelId, from.get(), to.get()) ?: return Response.status(NOT_FOUND).build()
        return Response.ok(stats).build()
    }
}