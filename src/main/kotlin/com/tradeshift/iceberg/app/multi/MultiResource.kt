package com.tradeshift.iceberg.app.multi

import com.tradeshift.iceberg.app.multi.dto.MultiDatum
import io.dropwizard.jersey.jsr310.LocalDateParam
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
    @Path("/{username}/{id}/data")
    fun postData(
        @NotNull @PathParam("username") username: String,
        @NotNull @PathParam("id") modelId: String,
        data: List<MultiDatum>
    ) {
        val model = service.getModel(username, modelId)
        if (model == null) {
            service.addModel(username, modelId)
        }
        service.addData(username, modelId, data)
    }

    @GET
    @Path("/{username}/{id}/stats")
    fun getStats(
        @NotNull @PathParam("username") username: String,
        @NotNull @PathParam("id") modelId: String,
        @QueryParam("from") from: LocalDateParam,
        @QueryParam("to") to: LocalDateParam
    ): Response {
        val stats = service.getStats(username, modelId, from.get(), to.get()) ?: return Response.status(NOT_FOUND).build()
        return Response.ok(stats).build()
    }
}