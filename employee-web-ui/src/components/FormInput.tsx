import { type InputHTMLAttributes } from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'

type Props = {
  label: string
} & Pick<
  InputHTMLAttributes<HTMLInputElement>,
  'id' | 'value' | 'onChange' | 'type'
>

export default function FormInput({ id, label, ...props }: Props) {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={id} className="text-right">
        {label}
      </Label>
      <Input id={id} className="col-span-3" required {...props} />
    </div>
  )
}
