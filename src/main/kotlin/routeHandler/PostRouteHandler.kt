package routeHandler

import com.google.gson.Gson
import jsonTemplate.ConfigurationTemplate
import org.json.JSONArray
import validation.*
import java.io.BufferedReader

class PostRouteHandler(var fieldArray: Array<ConfigurationTemplate> = arrayOf()) {


    private val dependencyValidation = DependencyValidation()
    private val lengthValidation = LengthValidation()
    private val valueValidation = ValueValidation()
    private val typeValidation = TypeValidation()
    private val duplicateValidation = DuplicateValidation()
    private val responseHeader: ResponseHeader = ResponseHeader()
    private val pageNotFoundResponse = PageNotFoundResponse()

    fun handlePostRequest(request: String, inputStream: BufferedReader): String {
        return when (getPath(request)) {
            "/csv" -> handleCsv(request, inputStream)
            "/add-meta-data" -> handleAddingCsvMetaData(request, inputStream)
            else -> pageNotFoundResponse.handleUnknownRequest()
        }
    }

    private fun getPath(request: String): String {
        return request.split("\r\n")[0].split(" ")[1].substringBefore("?")
    }

    private fun handleCsv(request: String, inputStream: BufferedReader): String {
        val bodySize = getContentLength(request)
        val body = getBody(bodySize, inputStream)
        return getResponseForCSV(body)
    }

    fun getResponseForCSV(body: String): String {
        val jsonBody = JSONArray(body)
        val lengthValidation = lengthValidation.validate(jsonBody, fieldArray)
        val typeValidation = typeValidation.validate(jsonBody, fieldArray)
        val valueValidation = valueValidation.validate(jsonBody, fieldArray)
        val duplicates = duplicateValidation.validate(jsonBody , fieldArray)
        val dependencyChecks = dependencyValidation.validate(jsonBody, fieldArray)
        val responseBody = getResponse(duplicates, lengthValidation, typeValidation, valueValidation, dependencyChecks)
        val contentLength = responseBody.length
        val endOfHeader = "\r\n\r\n"
        return responseHeader.getResponseHead(StatusCodes.TWOHUNDRED) + """Content-Type: text/json; charset=utf-8
                |Content-Length: $contentLength""".trimMargin() + endOfHeader + responseBody
    }

    private fun getResponse (
        duplicates: JSONArray,
        lengthValidation: JSONArray,
        typeValidation: JSONArray,
        valueValidation: JSONArray,
        dependencyChecks: Any
    ): String {
        var responseBody = "{"
        responseBody += "\"Duplicates\" : $duplicates"
        responseBody += ","
        responseBody += "\"Length\" : $lengthValidation"
        responseBody += ","
        responseBody += "\"Type\" : $typeValidation"
        responseBody += ","
        responseBody += "\"Value\" : $valueValidation"
        responseBody += ","
        responseBody += "\"Dependency\" : $dependencyChecks"
        responseBody += "}"
        return responseBody
    }


    private fun handleAddingCsvMetaData(request: String, inputStream: BufferedReader): String {
        val bodySize = getContentLength(request)
        val body = getBody(bodySize, inputStream)
        return getResponseForMetaData(body)
    }

    private fun getResponseForMetaData(body: String): String {
        val jsonBody = getMetaData(body)
        fieldArray = jsonBody
        val endOfHeader = "\r\n\r\n"
        val responseBody = "Successfully Added Configuration File"
        val contentLength = responseBody.length
        return responseHeader.getResponseHead(StatusCodes.TWOHUNDRED) + """Content-Type: text/plain; charset=utf-8
    |Content-Length: $contentLength""".trimMargin() + endOfHeader + responseBody
    }

    private fun getBody(bodySize: Int, inputStream: BufferedReader): String {
        val buffer = CharArray(bodySize)
        inputStream.read(buffer)
        return String(buffer)
    }

    fun getMetaData(body: String): Array<ConfigurationTemplate> {
        val gson = Gson()
        return gson.fromJson(body, Array<ConfigurationTemplate>::class.java)
    }

    private fun getContentLength(request: String): Int {
        request.split("\n").forEach { headerString ->
            val keyValue = headerString.split(":", limit = 2)
            if (keyValue[0].contains("Content-Length")) {
                return keyValue[1].trim().toInt()
            }
        }
        return 0
    }
    
}