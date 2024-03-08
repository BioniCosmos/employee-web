export interface Employee {
  id: string
  name: string
  gender: string
  age: number
  salary: number
  bonus: number
  annualSalary?: number
}

export function initEmployee(): Employee {
  return { id: '', name: '', gender: '', age: 0, salary: 0, bonus: 0 }
}
