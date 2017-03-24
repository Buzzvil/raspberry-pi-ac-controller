'use strict';
var Alexa = require('alexa-sdk');
var request = require('request-promise');

var APP_ID = undefined; //OPTIONAL: replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
var SKILL_NAME = 'Space Facts';

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('AMAZON.HelpIntent');
    },
    'ACIntent': function () {
        console.log(this.event.request.intent.slots)
        var sign = this.event.request.intent.slots.Sign.value
        if (sign == 'on') {
            return this.emit('ACTurnOn');
        } else if (sign == 'off') {
            return this.emit('ACTurnOff');
        }
        return this.emit('AMAZON.HelpIntent')
    },
    'ACTurnOn': function () {
        var that = this
        request.get("https://213dfa3f.ngrok.io/api/ac/on/").then(
            (response) => {
                this.emit(':tellWithCard', 'The AC is on', SKILL_NAME, 'Thanks')
                console.log(response);
            },
            (error) => {
                this.emit(':tellWithCard', 'uh-no, Something went wrong', SKILL_NAME, 'Something went wrong')
                console.error('uh-oh! ' + error);
            }
        );
    },
    'ACTurnOff': function () {
        var that = this
        request.get("https://213dfa3f.ngrok.io/api/ac/off/").then(
            (response) => {
                this.emit(':tellWithCard', 'The AC is off', SKILL_NAME, 'Thanks')
                console.log(response);
            },
            (error) => {
                this.emit(':tellWithCard', 'uh-no, Something went wrong', SKILL_NAME, 'Something went wrong')
                console.error('uh-oh! ' + error);
            }
        );
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = "You can say tell me a space fact, or, you can say exit... What can I help you with?";
        var reprompt = "What can I help you with?";
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Goodbye!');
    }
};