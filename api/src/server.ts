import express, { Express } from 'express'
import cors from 'cors'
import StatusCodes from 'http-status-codes'
import swaggerUi from 'swagger-ui-express'
import morgan from 'morgan'

import setUserContext from './middleware/userContext'
import router from './modules'
import MailingService from './modules/mailSender/mailingService'
import env from './config/env'

require('./config/logger')

const app: Express = express()

// eslint-disable-next-line @typescript-eslint/no-var-requires
const swaggerDocument = require('../docs/swagger.json')

router.use('/read-the-docs', swaggerUi.serve)
router.get('/read-the-docs', swaggerUi.setup(swaggerDocument))

app.use(
  express.json(),
  morgan('combined'),
  cors({
    origin: env.CLIENT_URL,
    optionsSuccessStatus: StatusCodes.OK
  }),
  setUserContext,
  router
)
// app.use(routes)
app.use('/up', (req, res) => {
  return res.send({ status: 'The Cope Notes Server is up and kicking!' })
})
app.use('*', (req, res) => {
  return res.status(StatusCodes.NOT_FOUND).send('404 Not Found')
})

// Start the mailing service when application starts
const mailingService = MailingService.getInstance()
mailingService.start()

export default app as Express
