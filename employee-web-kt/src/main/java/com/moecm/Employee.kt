package com.moecm

data class Employee(
    val id: String,
    val name: String,
    val gender: String,
    val age: Int,
    val salary: Double,
    val bonus: Double,
) {
    @Suppress("unused")
    val annualSalary get() = this.salary * 12 + this.bonus
}
