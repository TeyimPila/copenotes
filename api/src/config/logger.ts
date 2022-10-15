import logger from 'winston'

const {
  format: { combine, timestamp, json }
} = logger

logger.configure({
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), json()),
  transports: [new logger.transports.Console({})]
})
//
// if (process.env.NODE_ENV !== 'production') {
//   winston.add(
//     new winston.transports.Console({
//       format: winston.format.simple()
//     })
//   )
// }

export default logger
