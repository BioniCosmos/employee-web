import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  Dialog as DialogRoot,
  DialogTitle,
} from '@/components/ui/dialog'
import { type ChangeEventHandler, type FormEventHandler } from 'react'
import { type Employee } from '../lib/Employee'
import { sendAndEcho } from '../lib/request'
import FormInput from './FormInput'
import type { State } from './Table'

interface Props {
  state: State<Employee>
  handleInputChange: ChangeEventHandler<HTMLInputElement>
  afterSubmit: () => void
}

export default function Dialog({
  state: { open, title, data: employee },
  handleInputChange,
  afterSubmit,
}: Props) {
  if (employee === undefined) {
    return null
  }

  const submit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    if (
      await sendAndEcho(
        '/api/employee',
        employee,
        title === 'Create' ? 'POST' : 'PUT'
      )
    ) {
      afterSubmit()
    }
  }

  return (
    <DialogRoot open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <FormInput
              id="id"
              label="Id"
              value={employee.id}
              onChange={handleInputChange}
            />
            <FormInput
              id="name"
              label="Name"
              value={employee.name}
              onChange={handleInputChange}
            />
            <FormInput
              id="gender"
              label="Gender"
              value={employee.gender}
              onChange={handleInputChange}
            />
            <FormInput
              id="age"
              label="Age"
              value={employee.age}
              type="number"
              onChange={handleInputChange}
            />
            <FormInput
              id="salary"
              label="Salary"
              value={employee.salary}
              type="number"
              onChange={handleInputChange}
            />
            <FormInput
              id="bonus"
              label="Bonus"
              value={employee.bonus}
              type="number"
              onChange={handleInputChange}
            />
          </div>
          <DialogFooter>
            <Button>{title}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  )
}
