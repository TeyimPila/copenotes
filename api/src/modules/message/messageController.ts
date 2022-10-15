import { v4 } from 'uuid'
import StatusCodes from 'http-status-codes'

import mailingService from '../mailSender/mailingService'
import { Request, Response } from 'express'
import MessageModel from './messageModel'
import { CreateMessageDto, Message } from './types'
import { User } from '../user/types'
import UserModel from '../user/userModel'

export default {
  createMessage: async (req: Request, res: Response) => {
    try {
      const body: CreateMessageDto = req.body
      const message: Message = MessageModel.create({ _id: v4(), ...body }).save()

      if (message) {
        mailingService.getInstance().start()
      }

      return res.status(StatusCodes.OK).json({ message })
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error, message: 'Error while creating message' })
    }
  },
  getMessages: async (req: Request, res: Response) => {
    try {
      const messages: Message[] = MessageModel.find()

      return res.status(StatusCodes.OK).json({ messages })
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
    }
  }
}
