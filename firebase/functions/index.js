'use strict';
 
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

admin.initializeApp({
	credential: admin.credential.applicationDefault(),
  	databaseURL: 'ws://newagent-ahqlox.firebaseio.com/'
});
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  function SaveToDB(agent){
    const pizzatype = agent.parameters.type;
    const pizzatopping = agent.parameters.topping;
    const pizzasize = agent.parameters.size;
    const customername = agent.parameters.name;
    const customerphone = agent.parameters.phone;
    const customeraddress = agent.parameters.address;
    
    return admin.database().ref('data').set({
    	pizzatype: pizzatype,
      	pizzatopping: pizzatopping,
      	pizzasize: pizzasize,
      	customername: customername,
      	customerphone: customerphone,
      	customeraddress: customeraddress
  	});
  }
  
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('order', SaveToDB);
  agent.handleRequest(intentMap);
});
