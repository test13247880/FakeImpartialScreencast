import express from 'express';
import bodyParser from 'body-parser';

const app = express();

//https://endpoint-test-njmo.onrender.com/
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Handle GET requests
app.get('/', (req, res) => {
  try {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === 'token') {
      console.log('Verification successful. Responding to challenge.');
      res.send(req.query['hub.challenge']);

    } else {
      console.error('Invalid verification parameters in GET request.');
      res.status(400).send({ error: 'Invalid verification parameters' });
    }
  } catch (error) {
    console.error('Error handling GET request:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// Handle POST requests to /webhook endpoint
app.post('/', async (req, res) => {
  try {
    console.log('Incoming POST request to /webhook:', JSON.stringify(req.body));

    // Assuming req.body contains the expected data
    const body = req.body;
    var phoneNumber = body.entry[0].changes[0].value.messages[0].from;
    var messageToSend = body.entry[0].changes[0].value.messages[0].text.body;

    sendToWhatsApp(phoneNumber, messageToSend);

    res.status(200).json({ message: 'Webhook received successfully', data: req.body });
  } catch (error) {
    console.error('Error handling POST request to /webhook:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// Handle POST requests to other endpoints
app.post('/otherEndpoint', (req, res) => {
  try {
    console.log('Incoming POST request to a different endpoint:', JSON.stringify(req.body));
    res.status(200).send('Received POST request to a different endpoint');
  } catch (error) {
    console.error('Error handling POST request to a different endpoint:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// WhatsApp
function sendToWhatsApp(recipientNumber, body) {
  try {
    var phoneNumberID = '127927877080233';
    var accessToken = 'EAAMQK9ZBrFZB0BO4ZAWADZAZAmjBDIuZCqu5IdPXHvkr1GRkbMCeSeBqb6S80E1DsSAGTEEZC8ckNIMLvj9ZCUQUgIMvqNxmNZAufNjJKtyBo0fLDopFZCioQRCS8zydZAZCweE3HPit90b9ypU2dukWqY2AgfrevZC46EXGV1ICZBj0EPxanQCKZBHkVe8VRGPWm3VlCDLJFRpSi37F5UjdZBVmkm5BMvFtUtCF1QCtmhev';

    var message =

    {
      "messaging_product": "whatsapp",
      "recipient_type": "individual",
      "to": recipientNumber,
      "type": "text",
      "text": {
        "preview_url": false,
        "body": body
      }
    };

    // For Template
    // {
    //   'messaging_product': 'whatsapp',
    //   'to': recipientNumber,
    //   'type': 'template',
    //   'template': {
    //     'name': 'hello_world',
    //     'language': {
    //       'code': 'en_US'
    //     }
    //   }
    // };

    // Send the HTTP POST request to Facebook Graph API
    var url = `https://graph.facebook.com/v17.0/${phoneNumberID}/messages`;
    var options = {
      'method': 'post',
      'headers': {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
      },
      'body': JSON.stringify(message),
    };

    const response = fetch(url, options);

    if (response.status === 200) {
      console.log('Message sent successfully!');
    } else {
      console.error('Error sending message. Status:', response.status);


      console.error('Response Body:', responseBody);

      try {
        const errorDetails = JSON.parse(responseBody);
        console.error('Error Details:', errorDetails);
        // Check for specific error codes or messages in errorDetails
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
      }
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});