const sgMail = require('@sendgrid/mail')
const pug = require('pug')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const generateHTML = (fileName, options = {}) => {
    console.log('options', options)
    const html = pug.renderFile(`${__dirname}/../views/email/${fileName}.pug`, options)
    console.log(html)
    return html
}

module.exports = async (options) => {
    console.log('templateOptions', options.templateOptions)
    const msg = {
        to: options.user.email,
        from: 'test@example.com',
        subject: options.subject,
        html: generateHTML(options.fileName, options.templateOptions)
    }
    const response = await sgMail.send(msg)
    console.log(response)
    return response
}
