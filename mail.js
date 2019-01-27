const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const Notify = {
    sensor: (email, value) => {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const percent = 100 - ( value / 1024 * 100);
      const friendlyHumidity = `${Math.round(percent)}% of humidity`;
      let stateValue = {
        color: "#b5c041"
      }
      if(percent < 40) {
        stateValue.color = "#a6002c"
      }
      if(percent >= 40 && percent < 80) {
        stateValue.color = "#b5c041"
      }
      if(percent >= 80 && percent <= 100) {
        stateValue.color = "#2b4c09"
      }
      const msg = {
        to: email,
        from: 'notifications@ahorta.com',
        templateId: 'd-4314a62668dc407b82a05e7fd1906e47',
        dynamic_template_data: {
            state: friendlyHumidity,
            color: "white",
            bgcolor: stateValue.color,
            absolute: value
        },
        subject: 'We have a new status from your plant'
        //text: `The humidity value is ${value}`,
        //html:`The humidity value is ${value}`
      }
      return sgMail.send(msg);
  }
}

module.exports = Notify
