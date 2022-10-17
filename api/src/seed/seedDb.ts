import messages from './sampleMessages.json'
import MessageModel from '../modules/message/messageModel'
import { v4 } from 'uuid'
import logger from '../config/logger'

const main = () => {
  try {
    for (const message of messages) {
      MessageModel.create({ _id: v4(), ...message }).save()
    }
    logger.info('Messages saved')
  } catch (e) {
    logger.error('Error while seeding database', e)
  }
}

main()
