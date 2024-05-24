const Mailjet = require('node-mailjet')
const mailjet= Mailjet.apiConnect("60d26e0a13913f853d918d5664ccd95d","7c40fe9b7bb3d26e5930ef8a3412c158");


  module.exports = function(email,token,callback){

  const request = mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: 'nish63348@gmail.com',
              Name: 'Unknown',

        },
        To: [
          {
            Email: email,
            Name: 'You',
          },
        ],
        Subject: 'Signup verification',
        TextPart: 'Please click on below link to verify',
        HTMLPart:
          `<h3>Dear user, welcome to <a href="http://localhost:5500/verifyemail/${token}">Verify here</a>!</h3><br />May the delivery force be with you!`,
      },
    ],
  })
  request
    .then(result => {
      console.log(result.body)
      callback(null,result.body)
    })
    .catch(err => {
      console.log(err,null)
      callback(null,"something went wrong")

    })

  }