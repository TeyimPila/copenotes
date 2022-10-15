import sendgridMail from '@sendgrid/mail'
import env from './env'

sendgridMail.setApiKey(env.SENDGRID_API_KEY)
export default sendgridMail
