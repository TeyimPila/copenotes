export interface CreateMessageDto {
  message: string
  locale?: string
}

export interface Message {
  _id: string
  message: string
  locale: string
}
