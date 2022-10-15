import { NextFunction, Request, Response } from 'express'

export default {
  isAuth: async (req: Request, res: Response, next: NextFunction) => {
    // TODO: Add some authentication checks here to reject requests from unauthenticated users
    return next()
  }
}
