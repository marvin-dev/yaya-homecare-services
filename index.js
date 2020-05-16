const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');
const morgan = require('morgan');
const path = require('path');
const app = express();

app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'client/build')));

app.post('/api/inquiries', (req, res) => {
  nodemailer.createTestAccount((err, account) => {
    const htmlEmail = `
      <h2>Inquiry Details</h2>
      <ul>
        <h3>Name: ${req.body.name}</h3>
        <h3>Email: ${req.body.email}</h3>
        <h3>Contact Number: ${req.body.contact_number}</h3>
      </ul>
      <h2>Reason of contact</h2>
      <p>${req.body.subject}</p>
      <h2>Message</h2>
      <p>${req.body.message}</p>
    `

    let auth = {
      auth: {
        api_key: '690a0aec553ea43a30b68c83192fa5d3-3e51f8d2-de78fce3',
        domain: 'sandbox11cc06aef4ad41dea1e2046a5266a6ef.mailgun.org'
      }
    };

    // let transporter = nodemailer.createTransport({
    //     host: 'smtp.ethereal.email',
    //     port: 587,
    //     auth: {
    //         user: 'morris.mcclure59@ethereal.email',
    //         pass: 'jKVHvTp5NFVWY3sZ3p'
    //     }
    // });

    let transporter = nodemailer.createTransport(mailGun(auth));

    let mailOptions = {
      from: req.body.email,
      to: 'mbanton713@gmail.com',
      subject: req.body.subject,
      text: req.body.message,
      html: htmlEmail
    }

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.status(401).send("failed")
      } 
        res.status(201).send(`Message sent: ${info.message}`)
    })
  })
});

app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
})