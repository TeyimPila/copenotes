import dotenv from 'dotenv'
import path from 'path'
import logger from './logger'
import { Env } from '../shared/types'

const NODE_ENV = process.env.NODE_ENV || 'development'

if (NODE_ENV !== 'production') {
  const response = dotenv.config({ path: path.resolve(__dirname, `../../.env.${NODE_ENV}`) })

  if (!response.parsed) {
    logger.error(`Failed to load environment variables form ${NODE_ENV} environment`)
  }

  logger.info(`Parsed the following environment variables for ${NODE_ENV} environment`, response.parsed)
}

const env: Env = {
  MESSAGE_TEMPLATE_ID: process.env.MESSAGE_TEMPLATE_ID || '',
  APP_NAME: process.env.APP_NAME || 'copenotes-api',
  APP_PORT: process.env.APP_PORT ? Number(process.env.APP_PORT) : 8001,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || ''
}

export default env
