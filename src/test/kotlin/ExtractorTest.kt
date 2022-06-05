import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import java.io.BufferedReader
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.InputStreamReader
import java.net.Socket

internal class ExtractorTest {

    private val extractor = Extractor()

    @Test
    fun shouldBeAbleToExtractThePathForAGetRequest() {

        val request = "GET / HTTP/1.0" + "\n\n"
        val expectedPath = "/"

        val actualPath = extractor.extractPath(request)
        println(actualPath)

        assertEquals(expectedPath, actualPath)
    }

    @Test
    fun shouldBeAbleToExtractThePathForAPostRequest() {
        val request = """POST /add-meta-data HTTP/1.1 
                |Host: localhost:3002
                |Connection: keep-alive
                |Content-Length: 266""".trimMargin() + "\r\n\r\n"
        val expectedPath = "/add-meta-data"

        val actualPath = extractor.extractPath(request)
        println(actualPath)
        assertEquals(expectedPath, actualPath)
    }

    @Test
    fun shouldBeAbleToExtractTheContentLength() {
        val request = """POST /add-meta-data HTTP/1.1 
                |Host: localhost:3002
                |Connection: keep-alive
                |Content-Length: 266""".trimMargin() + "\r\n\r\n"
        val expectedContentLength = 266

        val actualContentLength = extractor.extractContentLength(request)

        assertEquals(expectedContentLength, actualContentLength)

    }

    @Test
    fun shouldBeAbleToExtractTheFileContentForMainJs() {
        val path = "/main.js"
        val content = extractor.extractFileContent(path)
        println(content)
        val actualContent = content.contains("\n" +
                "async function getConfigFilesName() {\n" +
                "    var resp = await fetch('get-config-files', {\n" +
                "        method: 'GET',\n" +
                "    })")

        assertTrue(actualContent)
    }

    @Test
    fun shouldBeAbleToExtractTheFileContentForMainCss() {
        val path = "/main.css"
        val content = extractor.extractFileContent(path)
        println(content)

        val actualContent = content.contains(
            "#myform {\n" +
                    "    margin-top: 1.5%;\n" +
                    "    margin-left: -60%;\n" +
                    "}"
        )

        assertTrue(actualContent)
    }

    @Test
    fun shouldBeAbleToExtractTheFileContentForIndexHTML() {
        val path = "/index.html"
        val content = extractor.extractFileContent(path)
        println(content)

        val actualContent = content.contains(
            "<div class=\"header\">\n" +
                    "    <div class=\"logo\">\n" +
                    "        <h1>CSV Parser And Validator</h1>\n" +
                    "    </div>\n" +
                    "</div>"
        )

        assertTrue(actualContent)
    }



    @Test
    fun shouldBeAbleToReturn200StatusCodeForValidCSSRequest() {
        val requestPath = "/main.css"
        val expectedStatusCode = 200

        val actualStatusCode = extractor.extractStatusCode(requestPath).statusCode

        assertEquals(expectedStatusCode ,actualStatusCode)
    }

    @Test
    fun shouldBeAbleToReturn200StatusCodeForValidRequest() {
        val requestPath = "/index.html"
        val expectedStatusCode = 200

        val actualStatusCode = extractor.extractStatusCode(requestPath).statusCode

        assertEquals(expectedStatusCode ,actualStatusCode)
    }

    @Test
    fun shouldBeAbleToReturn400StatusCodeForInValidRequest() {
        val requestPath = "/indebbx.html"
        val expectedStatusCode = 404

        val actualStatusCode = extractor.extractStatusCode(requestPath).statusCode

        assertEquals(expectedStatusCode ,actualStatusCode)
    }

    @Test
    fun shouldBeAbleToReturn400StatusCodeForInValidJSRequest() {
        val requestPath = "/main.js"
        val expectedStatusCode = 200

        val actualStatusCode = extractor.extractStatusCode(requestPath).statusCode

        assertEquals(expectedStatusCode ,actualStatusCode)
    }

    /*@Test
    fun shouldBeAbleToExtractBodyFromInputStream() {
        val expectedMetaData =
            """[{"fieldName":"Export","type":"Alphabets","length":"1","dependentOn":"","dependentValue":"","values":["Y","N"]},{"fieldName":"Country Name","type":"Alphabets","length":"4","dependentOn":"Export","dependentValue":"N","values":["Export,Country Name","Y,","N,USA",""]}]"""
        val mockSocket = createMockSocket(expectedMetaData)
        val inputStream = getInputStream(mockSocket)
        val bodySize = 266

        val actualMetaData = extractor.extractBody(bodySize , inputStream)

        assertEquals(expectedMetaData , actualMetaData)
    }*/

    @Test
    fun shouldBeAbleToExtractConfigName() {
        val body = """[{"configName":"testConfig1"}]"""
        val expectedConfigName = "testConfig1"

        val actualConfigName = extractor.extractConfigurationName(body)

        assertEquals(expectedConfigName , actualConfigName)
    }

    @Test
    fun shouldReturn404PageErrorForInvalidJavascriptFileGetRequest() {
        val extractor = Extractor()
        val response = extractor.extractErrorPageFileContent()
        val expectedFileContent = "<title>404PageNotFound</title>"
        val actualResponse = response.split('\n')[4].replace(" ", "")

        assertEquals(expectedFileContent, actualResponse)
    }

    private fun getInputStream(mockSocket: Socket): BufferedReader {
        return BufferedReader(InputStreamReader(mockSocket.getInputStream()))
    }

    private fun createMockSocket(data: String): Socket {
        val mockSocket = mockk<Socket>()
        every { mockSocket.getOutputStream() } returns ByteArrayOutputStream()
        every { mockSocket.getInputStream() } returns ByteArrayInputStream(data.toByteArray())
        return mockSocket
    }

}