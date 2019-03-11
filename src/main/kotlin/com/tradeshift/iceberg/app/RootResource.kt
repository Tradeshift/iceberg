import java.net.URI
import javax.ws.rs.GET
import javax.ws.rs.Path
import javax.ws.rs.core.Response

@Path("/")
class RootResource {

    @GET
    @Path("/")
    fun root(): Response {
        return Response.seeOther(URI.create("app")).build()
    }
}