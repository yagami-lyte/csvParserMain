package routeHandler

import JsonMetaDataTemplate
import ResponseHeader
import com.google.gson.Gson
import org.json.JSONArray
import org.json.JSONObject
import validation.DuplicateValidation
import validation.LengthValidation
import validation.TypeValidation
import validation.ValueValidation
import java.io.BufferedReader

class PostRouteHandler {

    var fieldArray: Array<JsonMetaDataTemplate> = arrayOf()

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
        val jsonBody = JSONArray(body)
        val lengthValidation = lengthValidation(jsonBody)
        val typeValidation = typeValidation(jsonBody)
        val valueValidation = valueValidation(jsonBody)
        val duplicates = DuplicateValidation().checkDuplicates(jsonBody)
        var responseBody = "{"
        responseBody += "\"Duplicates\" : \"$duplicates\""
        responseBody += "\"Length\" : \"$lengthValidation\""
        responseBody += "\"Type\" : \"$typeValidation\""
        responseBody += "\"Value\" : \"$valueValidation\""
        responseBody += "}"
        print(responseBody)
        val contentLength = responseBody.length
        val endOfHeader = "\r\n\r\n"
        return responseHeader.getResponseHead(StatusCodes.TWOHUNDRED) + """Content-Type: text/json; charset=utf-8
            |Content-Length: $contentLength""".trimMargin() + endOfHeader + responseBody
    }

    fun lengthValidation(jsonArrayData: JSONArray): List<Int> {
        val errorIndices = mutableListOf<Int>()
        val lengthValidation = LengthValidation()

        jsonArrayData.forEachIndexed { index, element ->
            val fieldElement = (element as JSONObject)
            val keys = fieldElement.keySet()
            for (key in keys) {
                val field = fieldArray.first { it.fieldName == key }
                val value = fieldElement.get(key) as String
                var flag = true
                if (field.length != null) {
                    if (!lengthValidation.lengthCheck(value, field.length)) {
                        flag = false
                    }
                }
                if (!flag) {
                    errorIndices.add(index + 1)
                    break
                }
            }
        }
        return errorIndices
    }

    fun typeValidation(dataInJSONArray: JSONArray): List<Int> {
        val errorIndices = mutableListOf<Int>()
        val typeValidation = TypeValidation()

        dataInJSONArray.forEachIndexed { index, element ->
            val ele = (element as JSONObject)
            val keys = ele.keySet()
            for (key in keys) {
                val field = fieldArray.first { it.fieldName == key }
                var flag = true
                val value = ele.get(key) as String
                if (field.type == "AlphaNumeric" && !typeValidation.isAlphaNumeric(value)) {
                    flag = false
                } else if (field.type == "Alphabet" && !typeValidation.isAlphabetic(value)) {
                    flag = false
                } else if (field.type == "Number" && !typeValidation.isNumeric(value)) {
                    flag = false
                }
                if (!flag) {
                    errorIndices.add(index + 1)
                    break
                }
            }
        }
        return errorIndices
    }

    fun valueValidation(dataInJSONArray: JSONArray): List<Int> {
        val errorIndices = mutableListOf<Int>()
        val valueValidation = ValueValidation()

        dataInJSONArray.forEachIndexed { index, element ->
            val ele = (element as JSONObject)
            val keys = ele.keySet()
            for (key in keys) {
                val field = fieldArray.first { it.fieldName == key }
                var flag = true
                val value = ele.get(key) as String
                if (field.values != null) {
                    if (!valueValidation.valueCheck(field.values, value)) {
                        flag = false
                    }
                }
                if (!flag) {
                    errorIndices.add(index + 1)
                    break
                }
            }
        }
        return errorIndices
    }


    private fun handleAddingCsvMetaData(request: String, inputStream: BufferedReader): String {
        val bodySize = getContentLength(request)
        val body = getBody(bodySize, inputStream)
        return addCsvMetaData(body)
    }

    fun addCsvMetaData(body: String): String {
        val jsonBody = getMetaData(body)
        print(jsonBody)
        fieldArray = jsonBody
        val endOfHeader = "\r\n\r\n"
        val responseBody = "Successfully Added"
        val contentLength = responseBody.length
        return responseHeader.getResponseHead(StatusCodes.TWOHUNDRED) + """Content-Type: text/plain; charset=utf-8
    |Content-Length: $contentLength""".trimMargin() + endOfHeader + responseBody
    }

    private fun getBody(bodySize: Int, inputStream: BufferedReader): String {
        val buffer = CharArray(bodySize)
        inputStream.read(buffer)
        return String(buffer)
    }

    fun getMetaData(body: String): Array<JsonMetaDataTemplate> {
        val gson = Gson()
        return gson.fromJson(body, Array<JsonMetaDataTemplate>::class.java)
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