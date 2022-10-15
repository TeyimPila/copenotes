import { v4 } from 'uuid'
import StatusCodes from 'http-status-codes'

import UserModel from './userModel'
import { CreateUserDto, User } from './types'
import { Request, Response } from 'express'
import mailingService from '../mailSender/mailingService'

export default {
  createUser: async (req: Request, res: Response) => {
    try {
      const body: CreateUserDto = req.body
      const user: User = UserModel.create({ _id: v4(), ...body }).save()

      if (user) {
        mailingService.getInstance().start()
      }

      return res.status(StatusCodes.OK).json({ user })
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
    }
  },
  getUsers: async (req: Request, res: Response) => {
    try {
      const users: User[] = UserModel.find()

      return res.status(StatusCodes.OK).json({ users })
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
    }
  }
}
