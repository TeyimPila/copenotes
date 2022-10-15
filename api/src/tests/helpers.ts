import MailingService from '../modules/mailSender/mailingService'
import UserModel from '../modules/user/userModel'
import UserMessageModel from '../modules/user/userMessageModel'
import MessageModel from '../modules/message/messageModel'

export const teardown = async () => {
  MailingService.getInstance().stop()

  clearDb()
}

export const clearDb = () => {
  UserModel.replaceModel([])
  UserMessageModel.replaceModel([])
  MessageModel.replaceModel([])
}
