import { Router } from 'express'
import messageRoutes from '../modules/message/routes'
import userRoutes from '../modules/user/routes'
const router = Router()

messageRoutes(router)
userRoutes(router)

export default router
