import middleware from '../../middleware'
import messageController from './messageController'

const { authMiddleware, messageValidators } = middleware
const { createMessage, getMessages } = messageController

export default function (router) {
  router.post('/api/v1/messages', authMiddleware.isAuth, messageValidators.validateMessage, createMessage)
  router.get('/api/v1/messages', authMiddleware.isAuth, getMessages)
}
