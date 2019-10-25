package com.tradeshift.iceberg.app.multi

import com.tradeshift.iceberg.app.multi.dto.MultiDatum
import com.tradeshift.iceberg.app.multi.dto.MultiModel
import com.tradeshift.iceberg.app.multi.dto.MultiStatsResponse
import io.dropwizard.jersey.jsr310.LocalDateParam
import java.util.*
import javax.validation.constraints.NotNull
import javax.ws.rs.*
import javax.ws.rs.core.MediaType
import javax.ws.rs.core.Response


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
    ): Response {
        service.addData(username, modelId, data)
        return Response.ok().build()
    }

    @PUT
    @Path("/{username}/{id}")
    fun putModel(
        @NotNull @PathParam("username") username: String,
        @NotNull @PathParam("id") modelId: String,
        model: MultiModel
    ): Response {
        service.putModel(model.copy(username = username, id = modelId))
        return Response.ok().build()
    }

    @GET
    @Path("/{username}/{id}/thresholds")
    fun getStats(
        @NotNull @PathParam("username") username: String,
        @NotNull @PathParam("id") modelId: String,
        @QueryParam("from") from: LocalDateParam,
        @QueryParam("to") to: LocalDateParam
    ): Optional<MultiStatsResponse> {
        return Optional.ofNullable(service.getStats(username, modelId, from.get(), to.get(), 10_000))
    }

    @GET
    @Path("/")
    fun getAllModels(
        @QueryParam("page") page: Int,
        @QueryParam("username") username: String?,
        @QueryParam("id") id: String?
    ): List<MultiModel> {
        return service.getModels(page, username, id)
    }

    @GET
    @Path("/{username}")
    fun getAllModelsForUser(
        @NotNull @PathParam("username") username: String,
        @QueryParam("page") page: Int
    ): List<MultiModel> {
        return service.getModelsForUser(username, page)
    }

    @GET
    @Path("/{username}/{id}")
    fun getModel(
        @NotNull @PathParam("username") username: String,
        @NotNull @PathParam("id") modelId: String
    ): Optional<MultiModel> {
        return Optional.ofNullable(service.getModel(username, modelId))
    }

    @DELETE
    @Path("/{username}/{id}")
    fun deleteModel(
        @NotNull @PathParam("username") username: String,
        @NotNull @PathParam("id") modelId: String
    ): Response {
        service.deleteModel(username, modelId)
        return Response.ok().build()
    }
}
