import app from './server'
import env from './config/env'
import logger from './config/logger'

export const startApp = async () => {
  try {
    app.listen(env.APP_PORT || 8001, '0.0.0.0', () => {
      logger.info(`Cope Notes api listening at http://localhost:${env.APP_PORT}`)
    })
  } catch (error) {
    logger.error('App failed to start', error)
    process.exit(1)
  }
}

startApp()
