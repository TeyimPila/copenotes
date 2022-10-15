import Schema from '../../config/database'

export default Schema('User', {
  _id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  locale: String,
  subscription: String // This could be an ENUM that indicates whether the user is subscribed or not or paused etc.
})
