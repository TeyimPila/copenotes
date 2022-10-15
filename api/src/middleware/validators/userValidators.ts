import StatusCodes from 'http-status-codes'
import validator from 'validator'

import { Request, Response, NextFunction } from 'express'
import { CreateUserDto } from '../../modules/user/types'
import UserModel from '../../modules/user/userModel'

export default {
  validateUserCreation: async (req: Request, res: Response, next: NextFunction) => {
    const { email, locale = 'en' }: CreateUserDto = req.body || {}
    const trimmedEmail = validator.trim(email)

    // TODO: We can define a set of currently supported locales and validate the local against that set

    if (!trimmedEmail || !validator.isEmail(trimmedEmail, { allow_utf8_local_part: false })) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid email provided' })
    }

    const existingUser = UserModel.find({ email: trimmedEmail })
    if (existingUser.length) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'User already exists' })
    }

    Object.assign(req.body, { email: trimmedEmail, locale })
    return next()
  }
}
