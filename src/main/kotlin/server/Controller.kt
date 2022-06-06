package server

import database.Connector
import database.DatabaseOperations
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import routeHandler.getRouteHandler.getResponse.ConfigNames
import routeHandler.getRouteHandler.getResponse.ErrorPage
import routeHandler.getRouteHandler.getResponse.HomePage
import routeHandler.postRouteHandler.postResponse.HandleCSVMetaData
import routeHandler.postRouteHandler.postResponse.HandleCsv
import routeHandler.postRouteHandler.postResponse.SendConfigurations


@RestController
class GreetingController {

    private val configNames = ConfigNames(DatabaseOperations(Connector()))
    private val errorPage = ErrorPage()
    private val homePage = HomePage()
    //    private val server = Server()
//    private val routeHandler = RouteHandler()
////    private val extractor = Extractor()
//
    private val handleCsv = HandleCsv()
    private val handleAddingCsvMetaData = HandleCSVMetaData()
    private val sendConfigurations = SendConfigurations(DatabaseOperations(Connector()))

//    private val pageNotFoundResponse = ErrorResponse()


//    Get Requests

    @GetMapping("/")
    fun getHTML() :String {
        return homePage.getResponse("/index.html")
    }

    @GetMapping("/main.js")
    fun getJs() :String {
        return homePage.getResponse("/main.js")
    }

    @GetMapping("/main.css")
    fun getCSS() :String {
        return homePage.getResponse("/main.css")
    }

    @GetMapping("/get-config-files")
    fun getConfigFiles() :String {
        return  configNames.getResponse("/get-config-files")
    }

    @GetMapping("/404.html")
    fun getErrorPage() :String {
        return  errorPage.getResponse("/404.html")
    }

//    Post Requests

    @PostMapping("/add-meta-data")
    fun postBody(@RequestBody configData: String): String {
        return handleAddingCsvMetaData.postResponse(configData)
    }

    @PostMapping("/csv")
    fun postCSV(@RequestBody csvData: String): String {
        return handleCsv.postResponse(csvData)
    }

    @PostMapping("/get-config-response")
    fun postGetConfigResponse(@RequestBody csvData: String): String {
        return sendConfigurations.postResponse(csvData)
    }


    /* @PostMapping("/add-meta-data")
     fun postAddMetaData() :String {
         *//*javaClass.getResourceAsStream(fileName).use { inputStream ->
            BufferedReader(InputStreamReader(inputStream!!)).use { reader ->
                val content =
                    reader.lines().collect(Collectors.joining(System.lineSeparator()))
            }
        }*//*
        val serverSocket = ServerSocket()
        val inputStream = BufferedReader(InputStreamReader(serverSocket.accept().getInputStream()))
        val outputStream = BufferedWriter(OutputStreamWriter(serverSocket.accept().getOutputStream()))

        val request = server.readRequest(inputStream)
        println("request $request")
        val methodType = server.getMethodType(request)
        val response = routeHandler.handleRequest(request, inputStream, methodType)

        server.sendResponse(outputStream, response)
//        clientSocket.close()

        return response
    }

    @PostMapping("/csv")
    fun postCSV() :String {
        *//*javaClass.getResourceAsStream(fileName).use { inputStream ->
            BufferedReader(InputStreamReader(inputStream!!)).use { reader ->
                val content =
                    reader.lines().collect(Collectors.joining(System.lineSeparator()))
            }
        }*//*
        val serverSocket = ServerSocket()
        val inputStream = BufferedReader(InputStreamReader(serverSocket.accept().getInputStream()))
        val outputStream = BufferedWriter(OutputStreamWriter(serverSocket.accept().getOutputStream()))

        val request = server.readRequest(inputStream)
        val methodType = server.getMethodType(request)
        val response = routeHandler.handleRequest(request, inputStream, methodType)

        server.sendResponse(outputStream, response)
//        clientSocket.close()

        return response
    }*/


}