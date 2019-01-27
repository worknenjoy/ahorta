const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const Notify = {
    sensor: (email, value) => {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: email,
        from: 'notifications@ahorta.com',
        subject: 'We made a new measure on your plant',
        text: `The humidity value is ${value}`,
        html:`The humidity value is ${value}`
      }
      return sgMail.send(msg);
  }
}

module.exports = Notify
