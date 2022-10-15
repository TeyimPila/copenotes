import Schema from '../../config/database'

export enum DeliveryStatus {
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED'
}

export default Schema('UserMessage', {
  _id: { type: String, required: true, unique: true },
  user: { type: String, required: true },
  message: { type: String, required: true },
  deliveryStatus: String // ENUM(SUCCEEDED, FAILED): This could be an ENUM that indicates whether the message was delivered successfully or not. This will be very useful in incidence recovery
})
