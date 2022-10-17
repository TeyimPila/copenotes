import { StatusCodes } from 'http-status-codes'
import { v4 } from 'uuid'

import MailingService from '../modules/mailSender/mailingService'
import MessageModel from '../modules/message/messageModel'
import UserMessageModel, { DeliveryStatus } from '../modules/user/userMessageModel'
import UserModel from '../modules/user/userModel'
import { teardown } from './helpers'
import { Message } from '../modules/message/types'
import { User } from '../modules/user/types'
import sendgridMail from '../config/sendgrid'
import env from '../config/env'

describe('mailingService', () => {
  afterEach(async () => {
    await teardown()
  })

  test('start method should start interval', () => {
    const instance1 = MailingService.getInstance()
    expect(instance1.intervalHandle).toBeNull()

    instance1.start()

    expect(instance1.intervalHandle).not.toBeNull()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(instance1.intervalHandle._idleTimeout).toBe(env.EXECUTION_INTERVAL_IN_MINUTES * 6000)

    // calling start again shouldn't restart a running cron
    instance1.start()

    const instance2 = MailingService.getInstance()
    expect(instance1.intervalHandle).toEqual(instance2.intervalHandle)
  })

  const runTestGetMessageToSend = possibleMessages => {
    const messageToSend = MailingService.getRandomMessageToSend()
    expect(possibleMessages).toContainEqual(messageToSend)
  }

  test('getRandomMessageToSend return undefined if all messages have been sent to all users', () => {
    const user1 = UserModel.create({ _id: v4(), email: 'user1@gmail.com' }).save()
    const user2 = UserModel.create({ _id: v4(), email: 'user2@gmail.com' }).save()
    const message1 = MessageModel.create({ _id: v4(), message: 'Awesome text message' }).save()
    const message2 = MessageModel.create({ _id: v4(), message: 'Another Awesome text message' }).save()

    UserMessageModel.create({ _id: v4(), user: user1._id, message: message1._id, deliveryStatus: DeliveryStatus.SUCCEEDED }).save()
    UserMessageModel.create({ _id: v4(), user: user1._id, message: message2._id, deliveryStatus: DeliveryStatus.SUCCEEDED }).save()
    UserMessageModel.create({ _id: v4(), user: user2._id, message: message1._id, deliveryStatus: DeliveryStatus.SUCCEEDED }).save()
    UserMessageModel.create({ _id: v4(), user: user2._id, message: message2._id, deliveryStatus: DeliveryStatus.SUCCEEDED }).save()

    // Make sure that records were created successfully
    expect(MessageModel.find().length).toEqual(2)
    expect(UserModel.find().length).toEqual(2)
    expect(UserMessageModel.find().length).toEqual(4)

    runTestGetMessageToSend([undefined])
  })

  test('getRandomMessageToSend should return a random message that was not sent successfully to at least 1 user', () => {
    const user1 = UserModel.create({ _id: v4(), email: 'user1@gmail.com' }).save()
    const user2 = UserModel.create({ _id: v4(), email: 'user2@gmail.com' }).save()
    const message1 = MessageModel.create({ _id: v4(), message: 'Awesome text message' }).save()
    const message2 = MessageModel.create({ _id: v4(), message: 'Another Awesome text message' }).save()
    const message3 = MessageModel.create({ _id: v4(), message: 'Not yet sent to anyone' }).save()

    UserMessageModel.create({ _id: v4(), user: user1._id, message: message1._id, deliveryStatus: DeliveryStatus.SUCCEEDED }).save()
    UserMessageModel.create({ _id: v4(), user: user1._id, message: message2._id, deliveryStatus: DeliveryStatus.FAILED }).save()
    UserMessageModel.create({ _id: v4(), user: user2._id, message: message1._id, deliveryStatus: DeliveryStatus.SUCCEEDED }).save()
    UserMessageModel.create({ _id: v4(), user: user2._id, message: message2._id, deliveryStatus: DeliveryStatus.SUCCEEDED }).save()

    // Make sure that records were created successfully
    expect(MessageModel.find().length).toEqual(3)
    expect(UserModel.find().length).toEqual(2)
    expect(UserMessageModel.find().length).toEqual(4)

    // Notice that message2 failed to deliver to user 1. So we can attempt to send message 2 to user one again
    runTestGetMessageToSend([message2, message3])
  })

  test('getRandomMessageToSend should return NO message if no users exist to receive it', () => {
    MessageModel.create({ _id: v4(), message: 'Awesome text message' }).save()
    MessageModel.create({ _id: v4(), message: 'Another Awesome text message' }).save()
    MessageModel.create({ _id: v4(), message: 'Not yet sent to anyone' }).save()

    // Make sure that records were created successfully
    expect(MessageModel.find().length).toEqual(3)

    // Notice that message2 failed to deliver to user 1. So we can attempt to send message 2 to user one again
    runTestGetMessageToSend([undefined])
  })

  test('getRandomMessageToSend should return a random message that has not been sent to any users AND users exist', () => {
    const message1 = MessageModel.create({ _id: v4(), message: 'Awesome text message' }).save()
    const message2 = MessageModel.create({ _id: v4(), message: 'Another Awesome text message' }).save()
    const message3 = MessageModel.create({ _id: v4(), message: 'Not yet sent to anyone' }).save()

    UserModel.create({ _id: v4(), email: 'user1@gmail.com' }).save()

    // Make sure that records were created successfully
    expect(MessageModel.find().length).toEqual(3)

    // Notice that message2 failed to deliver to user 1. So we can attempt to send message 2 to user one again
    runTestGetMessageToSend([message1, message2, message3])
  })

  test('getEligibleMessageRecipients should get all users who have not yet received given message or failed to receive the message', () => {
    const user1 = UserModel.create({ _id: v4(), email: 'user1@gmail.com' }).save()
    const user2 = UserModel.create({ _id: v4(), email: 'user2@gmail.com' }).save()
    const message1 = MessageModel.create({ _id: v4(), message: 'Awesome text message' }).save()
    const message2 = MessageModel.create({ _id: v4(), message: 'Another Awesome text message' }).save()
    const message3 = MessageModel.create({ _id: v4(), message: 'Not yet sent to anyone' }).save()

    UserMessageModel.create({ _id: v4(), user: user1._id, message: message1._id, deliveryStatus: DeliveryStatus.SUCCEEDED }).save()
    UserMessageModel.create({ _id: v4(), user: user1._id, message: message2._id, deliveryStatus: DeliveryStatus.FAILED }).save()
    UserMessageModel.create({ _id: v4(), user: user2._id, message: message1._id, deliveryStatus: DeliveryStatus.SUCCEEDED }).save()
    UserMessageModel.create({ _id: v4(), user: user2._id, message: message2._id, deliveryStatus: DeliveryStatus.SUCCEEDED }).save()

    // Make sure that records were created successfully
    expect(MessageModel.find().length).toEqual(3)
    expect(UserModel.find().length).toEqual(2)
    expect(UserMessageModel.find().length).toEqual(4)

    const testData: { message: Message; eligibleRecipients: User[] }[] = [
      {
        message: message1,
        eligibleRecipients: []
      },
      {
        message: message2,
        eligibleRecipients: [user1] // sending to user1 failed
      },
      {
        message: message3,
        eligibleRecipients: [user1, user2] // message 3 hasn't been sent to any users yet
      }
    ]
    for (const { message, eligibleRecipients } of testData) {
      const expectedRecipients = MailingService.getInstance().getEligibleMessageRecipients(message)

      expect(expectedRecipients.length).toEqual(eligibleRecipients.length)
      expect(expectedRecipients).toEqual(expect.arrayContaining(eligibleRecipients))
    }
  })

  test('sendMessages should successfully send messages and create UserMessages', async () => {
    sendgridMail.send = jest.fn().mockReturnValue([{ statusCode: StatusCodes.ACCEPTED }])

    UserModel.create({ _id: v4(), email: 'user1@gmail.com' }).save()
    UserModel.create({ _id: v4(), email: 'user2@gmail.com' }).save()
    UserModel.create({ _id: v4(), email: 'user3@gmail.com' }).save()
    MessageModel.create({ _id: v4(), message: 'Awesome text message 1' }).save()
    MessageModel.create({ _id: v4(), message: 'Awesome text message 2' }).save()

    expect(UserMessageModel.find().length).toEqual(0)

    const mailService = MailingService.getInstance()
    await mailService.sendMessage()

    expect(sendgridMail.send).toHaveBeenCalledTimes(3)
    const userMessages = UserMessageModel.find()
    // Test runs in less than a minute, so only 1 of the 2 messages should have been sent
    expect(userMessages.length).toEqual(3)
    expect(userMessages.every(um => um.deliveryStatus === DeliveryStatus.SUCCEEDED)).toBeTruthy()
  })

  test('sendMessage should only send a message to users who have not received it before', async () => {
    const mockSend = jest.fn().mockReturnValue([{ statusCode: StatusCodes.ACCEPTED }])
    sendgridMail.send = mockSend

    const user1 = UserModel.create({ _id: v4(), email: 'user1@gmail.com' }).save()
    const user2 = UserModel.create({ _id: v4(), email: 'user2@gmail.com' }).save()
    const message1 = MessageModel.create({ _id: v4(), message: 'Awesome text message' }).save()
    const message2 = MessageModel.create({ _id: v4(), message: 'Another Awesome text message' }).save()

    UserMessageModel.create({ _id: v4(), user: user1._id, message: message1._id, deliveryStatus: DeliveryStatus.SUCCEEDED }).save()
    UserMessageModel.create({ _id: v4(), user: user1._id, message: message2._id, deliveryStatus: DeliveryStatus.FAILED }).save()
    UserMessageModel.create({ _id: v4(), user: user2._id, message: message1._id, deliveryStatus: DeliveryStatus.SUCCEEDED }).save()
    UserMessageModel.create({ _id: v4(), user: user2._id, message: message2._id, deliveryStatus: DeliveryStatus.SUCCEEDED }).save()

    // Make sure that records were created successfully
    expect(MessageModel.find().length).toEqual(2)
    expect(UserModel.find().length).toEqual(2)
    expect(UserMessageModel.find().length).toEqual(4)

    const mailService = MailingService.getInstance()
    await mailService.sendMessage()

    // message 3 is sent to each of the two users
    expect(UserMessageModel.find().length).toEqual(4)
    const previouslyFailedDelivery = UserMessageModel.find({ user: user1._id, message: message2._id })[0]
    expect(previouslyFailedDelivery.deliveryStatus).toEqual(DeliveryStatus.SUCCEEDED)
    expect(sendgridMail.send).toHaveBeenCalledTimes(1) // resend the previously failed delivery

    mockSend.mockClear()
    // running send messages twice should resend messages
    await mailService.sendMessage()
    expect(UserMessageModel.find().length).toEqual(4)
    expect(sendgridMail.send).toHaveBeenCalledTimes(0)
  })

  test('if all users have received all messages, sendMessage should not send any message', async () => {
    sendgridMail.send = jest.fn().mockReturnValue([{ statusCode: StatusCodes.ACCEPTED }])
    const user1 = UserModel.create({ _id: v4(), email: 'user1@gmail.com' }).save()
    const user2 = UserModel.create({ _id: v4(), email: 'user2@gmail.com' }).save()
    const message1 = MessageModel.create({ _id: v4(), message: 'Awesome text message' }).save()
    const message2 = MessageModel.create({ _id: v4(), message: 'Another Awesome text message' }).save()

    UserMessageModel.create({ _id: v4(), user: user1._id, message: message1._id, deliveryStatus: DeliveryStatus.SUCCEEDED }).save()
    UserMessageModel.create({ _id: v4(), user: user1._id, message: message2._id, deliveryStatus: DeliveryStatus.SUCCEEDED }).save()
    UserMessageModel.create({ _id: v4(), user: user2._id, message: message1._id, deliveryStatus: DeliveryStatus.SUCCEEDED }).save()
    UserMessageModel.create({ _id: v4(), user: user2._id, message: message2._id, deliveryStatus: DeliveryStatus.SUCCEEDED }).save()

    const mailService = MailingService.getInstance()
    await mailService.sendMessage()

    expect(sendgridMail.send).not.toHaveBeenCalled()
  })

  test('sendMessageToUser should call sendgrid send method', () => {
    sendgridMail.send = jest.fn()
    const user = UserModel.create({ _id: v4(), email: 'user1@gmail.com' }).save()
    const message = MessageModel.create({ _id: v4(), message: 'Awesome text message' }).save()

    MailingService.sendUserMessage(user, message)

    expect(sendgridMail.send).toHaveBeenCalledTimes(1)
  })
})
