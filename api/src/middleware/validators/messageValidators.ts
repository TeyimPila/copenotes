import StatusCodes from 'http-status-codes'
import { Request, Response, NextFunction } from 'express'

import { CreateMessageDto } from '../../modules/message/types'
import MessageModel from '../../modules/message/messageModel'

export default {
  validateMessage: async (req: Request, res: Response, next: NextFunction) => {
    const { message }: CreateMessageDto = req.body || {}

    if (!message || !message.trim()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Message is required' })
    }

    const existingMessage = MessageModel.find({ message })
    if (existingMessage.length) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Message already exists' })
    }

    return next()
  }
}
