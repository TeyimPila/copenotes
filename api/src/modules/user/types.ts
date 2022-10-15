export interface CreateUserDto {
  email: string
  locale?: string
}

export interface User {
  _id: string
  email: string
  locale: string
}
