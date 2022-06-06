package database


import java.sql.Connection
import java.sql.DriverManager

class Connector : DatabaseConnector {
    override fun makeConnection(): Connection {
        val user = "postGre"
        val password = "postGre"
        return DriverManager.getConnection("postgres://vcbmkareybcfuj:1472a5b4872eff85846616a7cefeadb5a8c11faa5e838a5e663778ecb7f1b00f@ec2-54-147-33-38.compute-1.amazonaws.com:5432/d5thkls1el9a60")
    }
}