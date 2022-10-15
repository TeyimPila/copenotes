import middleware from '../../middleware'
import userController from './userController'

const { createUser, getUsers } = userController
const { authMiddleware, userValidators } = middleware

export default function (router) {
  router.get('/api/v1/users', authMiddleware.isAuth, getUsers)
  router.post('/api/v1/users', authMiddleware.isAuth, userValidators.validateUserCreation, createUser)
}
