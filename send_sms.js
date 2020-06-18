

// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
const accountSid = 'AC23accf08ab9a97b00a23d577bf21a7d3';
const authToken = '24ed6f367c4887e3e99bef8d12b0da33';
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
     from: '+17043248153',
     to: '+18106241057'
   })
  .then(message => console.log(message.sid));