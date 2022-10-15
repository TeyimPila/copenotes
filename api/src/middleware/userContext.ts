import { NextFunction, Request, Response } from 'express'

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    Object.assign(req, { context: {} })

    // TODO: Here, we can inject a context in the request that's used in auth middleware and in controllers

    return next()
  } catch (error) {
    return next()
  }
}
