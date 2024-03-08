package com.moecm

class EmployeeDb(private var employees: List<Employee> = listOf()) {
    fun init() {
        this.employees = listOf(
            Employee("xk32c9j8", "Frank", "Male", 40, 4431.0, 295.0),
            Employee("r3s9p1v5", "Emma", "Female", 45, 3937.0, 722.0),
            Employee("s5n9v8h3", "Jack", "Male", 29, 6191.0, 79.0),
            Employee("y8v5s1r3", "Henry", "Male", 52, 4837.0, 313.0),
            Employee("j4t8v5s2", "Ivy", "Female", 65, 3603.0, 663.0),
            Employee("r5p1v9s7", "David", "Male", 61, 6262.0, 67.0),
            Employee("t1s7r5v9", "Alice", "Female", 67, 3208.0, 569.0),
            Employee("w3v9h7s5", "Jack", "Male", 43, 3822.0, 252.0),
            Employee("h5s2r8v4", "Alice", "Female", 55, 3679.0, 700.0),
            Employee("u9v8s3r6", "Grace", "Female", 32, 3355.0, 500.0)
        )
    }

    fun addOne(employee: Employee) = this.queryOneById(employee.id)?.let {
        this.employees += employee
        true
    } ?: false

    fun removeOneById(id: String): Boolean {
        val originalSize = this.employees.size
        this.employees = this.employees.filter { it.id != id }
        return this.employees.size != originalSize
    }

    fun removeManyById(ids: List<String>) =
        ids.map { this.removeOneById(it) }.all { true }

    fun update(newEmployee: Employee) = this.employees.map {
        if (it.id == newEmployee.id) newEmployee to true else it to false
    }.let { pair ->
        this.employees = pair.map { it.first }
        pair.map { it.second }.any { true }
    }

    fun queryOneById(id: String) = this.employees.find { it.id == id }

    fun queryAll() = this.employees
}
