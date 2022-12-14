import logger from '../../config/logger'
import { StatusCodes } from 'http-status-codes'
import { v4 } from 'uuid'

import sendgridMail from '../../config/sendgrid'
import { Message } from '../message/types'
import MessageModel from '../message/messageModel'
import UserModel from '../user/userModel'
import UserMessageModel, { DeliveryStatus } from '../user/userMessageModel'
import { User } from '../user/types'
import env from '../../config/env'

export default class MailingService {
  private static instance: MailingService
  intervalHandle: NodeJS.Timeout | null

  constructor() {
    this.intervalHandle = null
  }

  // This class is a singleton to make sure that we don't have multiple instances running different crons
  public static getInstance(): MailingService {
    if (!MailingService.instance) {
      MailingService.instance = new MailingService()
    }

    return MailingService.instance
  }

  static async sendUserMessage(recipient: User, message: Message): Promise<any> {
    try {
      const mailConfig = {
        to: recipient.email,
        from: 'Cope Notes <animalfarm.app@gmail.com>',
        templateId: env.MESSAGE_TEMPLATE_ID,
        dynamicTemplateData: {
          message: message.message
        }
      }
      return await sendgridMail.send(mailConfig)
    } catch (error) {
      logger.error('Email failed to deliver', { error })
    }
  }

  public static getRandomMessageToSend(): Message | undefined {
    // In a DBMS that supports more complex queries, for better performance, I would use joins to get only the message that hasn't been sent "SUCCESSFULLY" to all users
    const messagesThatCanBeSent = MessageModel.find().filter(message => {
      const userIds = UserModel.find().map(({ _id }) => _id)

      // user messages that were sent to all users successfully.
      // In a production-grade application, this query should be cached
      const successfulDeliveries = UserMessageModel.find({
        message: message._id,
        user: { $in: userIds },
        deliveryStatus: DeliveryStatus.SUCCEEDED
      })

      return successfulDeliveries.length != userIds.length
    })

    if (!messagesThatCanBeSent.length) {
      return
    }

    // return a random message
    return messagesThatCanBeSent[Math.floor(Math.random() * messagesThatCanBeSent.length)]
  }

  getEligibleMessageRecipients(message: Message): User[] {
    return UserModel.find().filter(user => {
      // In a production-grade application, this query should be cached and the whole method should use a more performant query
      const successfulDeliveries = UserMessageModel.find({
        message: message._id,
        user: user._id,
        deliveryStatus: DeliveryStatus.SUCCEEDED
      })

      // Get only users who have no successfully received this message
      return successfulDeliveries.length === 0
    })
  }

  start(): void {
    if (this.intervalHandle) {
      logger.warn('MailingService already started')
      return
    }
    this.intervalHandle = setInterval(() => this.sendMessage(), env.EXECUTION_INTERVAL_IN_MINUTES * 6000) // dynamic interval
    logger.info('MailingService started')
  }

  stop(): void {
    if (!this.intervalHandle) {
      return
    }
    clearInterval(this.intervalHandle)
    this.intervalHandle = null
    logger.info('MailingService stopped')
  }

  async sendMessage(): Promise<void> {
    try {
      const messageToSend: Message | undefined = MailingService.getRandomMessageToSend()

      // If there wasn't a message to send, then stop interval
      if (!messageToSend) {
        logger.info('All messages have been sent to all users. Stopping mail sender...')
        this.stop()
        return
      }

      const eligibleRecipients: User[] = this.getEligibleMessageRecipients(messageToSend)

      logger.info('sending messages to users...', { messageToSend, eligibleRecipients })
      await Promise.all(
        eligibleRecipients.map(async recipient => {
          const responses = await MailingService.sendUserMessage(recipient, messageToSend)
          const statusCode = responses?.[0]?.statusCode

          if (statusCode !== StatusCodes.ACCEPTED) {
            logger.warn('Failed to deliver message to user', { message: messageToSend, recipient })
            return
          }

          const existingUserMessages = UserMessageModel.find({
            user: recipient._id,
            message: messageToSend._id,
            deliveryStatus: DeliveryStatus.FAILED
          })

          // if the message was sent unsuccessfully before, update the delivery status
          if (existingUserMessages.length) {
            const existingUserMessage = existingUserMessages[0]
            existingUserMessage.deliveryStatus = statusCode === StatusCodes.ACCEPTED ? 'SUCCEEDED' : 'FAILED'
            existingUserMessage.save()
            return
          }

          UserMessageModel.create({
            _id: v4(),
            user: recipient._id,
            message: messageToSend._id,
            deliveryStatus: statusCode === StatusCodes.ACCEPTED ? 'SUCCEEDED' : 'FAILED'
          }).save()
        })
      )
    } catch (error) {
      logger.error('Error when attempting to send message', error)
    }
  }
}
