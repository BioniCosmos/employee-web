package com.moecm

import io.javalin.Javalin
import io.javalin.http.ContentType
import io.javalin.http.Context
import io.javalin.http.HttpStatus
import io.javalin.http.bodyAsClass

fun main() {
    val app = Javalin.create()
    val db = EmployeeDb()
    db.init()

    app.get("/api/employees") { ctx ->
        val cursor = ctx.queryParam("cursor")
        val limit = ctx.queryParam("limit")?.toInt() ?: 5
        ctx.json(Cursor(db.queryAll(), cursor, limit))
    }
    app.get("/api/employee/{id}") { ctx ->
        val id = ctx.pathParam("id")
        db.queryOneById(id)?.let { ctx.json(it) } ?: sendStatus(
            ctx, HttpStatus.NOT_FOUND
        )
    }
    app.post("/api/employee") { ctx ->
        val employee = ctx.bodyAsClass<Employee>()
        val status =
            if (db.addOne(employee)) HttpStatus.CREATED else HttpStatus.CONFLICT
        sendStatus(ctx, status)
    }
    app.put("/api/employee") { ctx ->
        val employee = ctx.bodyAsClass<Employee>()
        val status =
            if (db.update(employee)) HttpStatus.OK else HttpStatus.NOT_FOUND
        sendStatus(ctx, status)
    }
    app.delete("/api/employee/{id}") { ctx ->
        val id = ctx.pathParam("id")
        val status =
            if (db.removeOneById(id)) HttpStatus.OK else HttpStatus.NOT_FOUND
        sendStatus(ctx, status)
    }
    app.delete("/api/employees") { ctx ->
        val ids = ctx.bodyAsClass<List<String>>()
        val status =
            if (db.removeManyById(ids)) HttpStatus.OK else HttpStatus.NOT_FOUND
        sendStatus(ctx, status)
    }

    app.start(8080)
}

private fun sendStatus(ctx: Context, status: HttpStatus) {
    ctx.status(status).contentType(ContentType.APPLICATION_JSON).result(
        String.format(
            "{\"code\":%d,\"message\":\"%s\"}", status.code, status.message
        )
    )
}
