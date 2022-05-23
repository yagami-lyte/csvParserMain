package routeHandler.getRouteHandler

import Extractor
import database.Connector
import database.DatabaseOperations
import routeHandler.getRouteHandler.getResponse.ConfigNames
import routeHandler.getRouteHandler.getResponse.ErrorPage
import routeHandler.getRouteHandler.getResponse.HomePage

class GetRouteHandler {

    private val configNames = ConfigNames(DatabaseOperations(Connector()))
    private val errorPage = ErrorPage()
    private val homePage = HomePage()
    private val extractor = Extractor()
    private val mapOfPaths = mapOf(
        "/" to homePage.getResponse("/index.html"),
        "/main.js" to homePage.getResponse("/main.js"),
        "/main.css" to homePage.getResponse("/main.css"),
        "/get-config-files" to configNames.getResponse("/get-config-files")
    )

    fun handleGetRequest(request: String): String {
        val path = extractor.extractPath(request)
        return mapOfPaths.getOrDefault(path, errorPage.getResponse("/404.html"))
    }

}