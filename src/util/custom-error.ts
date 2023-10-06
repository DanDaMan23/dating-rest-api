export default class CustomError<T> extends Error {
  statusCode: number
  data: T[]

  constructor(statusCode: number, message: string, data: T[] = []) {
    super(message)
    this.statusCode = statusCode
    this.data = data

    Object.setPrototypeOf(this, CustomError.prototype)
  }
}
