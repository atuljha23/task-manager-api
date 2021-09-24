const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'jhaat@tcd.ie',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
})
}
const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'jhaat@tcd.ie',
        subject: 'We are sorry to see you go :(',
        text: `Hey, ${name}. We are sorry to see you go, please send us an email if you have any feedback for us or if there is something we can do to have you back onboard.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}