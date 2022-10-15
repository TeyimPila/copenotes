import Schema from '../../config/database'

export default Schema('Message', {
  _id: { type: String, required: true, unique: true },
  message: { type: String, required: true, unique: true },
  locale: String
})
