package com.moecm

@Suppress("MemberVisibilityCanBePrivate")
class Cursor(data: List<Employee>, cursor: String?, limit: Int) {
    val data: List<Employee>
    val nextCursor: String?

    init {
        val c = if (cursor.isNullOrBlank()) data.first().id else cursor
        val start = data.indexOfFirst { it.id == c }
        val len = minOf(limit, data.size - start)
        val end = start + len
        this.data = data.slice(start until end)
        this.nextCursor = data.getOrNull(end)?.id
    }
}
