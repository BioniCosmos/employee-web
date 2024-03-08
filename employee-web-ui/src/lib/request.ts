import { toast } from 'react-hot-toast'

export type FetchParameters = Parameters<typeof fetch>

export interface DefaultResponse {
  code: number
  message: string
}

export async function request<T = DefaultResponse>(
  ...args: FetchParameters
): Promise<[boolean, T | DefaultResponse]> {
  const res = await fetch(...args)
  return res.ok
    ? [true, (await res.json()) as T]
    : [false, (await res.json()) as DefaultResponse]
}

export const fetcher = (...args: FetchParameters) =>
  fetch(...args).then((res) => res.json())

export const send = (
  input: FetchParameters['0'],
  body: unknown,
  method: string
) =>
  request(input, {
    method,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  })

export async function toastPromise(req: Promise<[boolean, DefaultResponse]>) {
  const id = toast.loading('Sending…')
  const [ok, { message }] = await req
  ok ? toast.success(message, { id }) : toast.error(message, { id })
  return ok
}

export async function sendAndEcho(...args: Parameters<typeof send>) {
  const req = send(...args)
  return toastPromise(req)
}
