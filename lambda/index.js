'use strict';
var AWS = require("aws-sdk");
var Alexa = require('alexa-sdk');
var request = require('request-promise');

var APP_ID = undefined; //OPTIONAL: replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
var SKILL_NAME = 'pi';
AWS.config.update({
  region: 'us-east-1',
  endpoint: 'https://dynamodb.us-east-1.amazonaws.com'
});
var docClient = new AWS.DynamoDB.DocumentClient();

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
        getUrl('3rd', (url, error) => {
            if (error) {
                that.emit(':tellWithCard', 'Sorry, something went wrong when I tried to turn on the ac', SKILL_NAME, 'Something went wrong')
                console.error('uh-oh! ' + error);
                return;
            }
            // Make a request
            console.log('sending AC request to ' + url)
            return request.get(url + '/api/ac/on/').then(
                (response) => {
                    that.emit(':tellWithCard', 'The AC is on', SKILL_NAME, 'Thanks')
                    console.log(response);
                },
                (error) => {
                    that.emit(':tellWithCard', 'Sorry, Something went wrong when I tried turn on the ac', SKILL_NAME, 'Something went wrong')
                    console.error('uh-oh! ' + error);
                }
            );
        });
    },
    'ACTurnOff': function () {
        var that = this
        getUrl('3rd', (url, error) => {
            if (error) {
                that.emit(':tellWithCard', 'Sorry, something went wrong when I tried to turn off the ac', SKILL_NAME, 'Something went wrong')
                console.error('uh-oh! ' + error);
                return;
            }
            // Make a request
            console.log('sending AC request to ' + url)
            return request.get(url + 'api/ac/off/').then(
                (response) => {
                    that.emit(':tellWithCard', 'The AC is off', SKILL_NAME, 'Thanks')
                    console.log(response);
                },
                (error) => {
                    that.emit(':tellWithCard', 'Sorry, Something went wrong when I tried turn off the ac', SKILL_NAME, 'Something went wrong')
                    console.error('uh-oh! ' + error);
                }
            );
        });
    },
    'MolangIntent': function () {
        console.log(this.event.request.intent.slots)
        var sign = this.event.request.intent.slots.Sign.value
        if (sign == 'on') {
            return this.emit('MolangTurnOn');
        } else if (sign == 'off') {
            return this.emit('MolangTurnOff');
        }
        var color = this.event.request.intent.slots.Color.value
        if (color == 'red') {
            return this.emit('MolangColor', color);
        } else if (sign == 'blue') {
            return this.emit('MolangColor', color);
        } else if (sign == 'green') {
            return this.emit('MolangColor', color);
        }
        return this.emit('AMAZON.HelpIntent')
    },
    'MolangTurnOn': function () {
        var that = this
        getUrl('3rd', (url, error) => {
            if (error) {
                that.emit(':tellWithCard', 'Sorry, something went wrong when I tried to turn on Molang', SKILL_NAME, 'Something went wrong')
                console.error('uh-oh! ' + error);
                return;
            }
            // Make a request
            console.log('sending Molang request to ' + url)
            return request.get(url + '/api/light/on/').then(
                (response) => {
                    that.emit(':tellWithCard', 'Molang is on', SKILL_NAME, 'Thanks')
                    console.log(response);
                },
                (error) => {
                    that.emit(':tellWithCard', 'Sorry, Something went wrong when I tried turn on Molang', SKILL_NAME, 'Something went wrong')
                    console.error('uh-oh! ' + error);
                }
            );
        });
    },
    'MolangTurnOff': function () {
        var that = this
        getUrl('3rd', (url, error) => {
            if (error) {
                that.emit(':tellWithCard', 'Sorry, something went wrong when I tried to turn off Molang', SKILL_NAME, 'Something went wrong')
                console.error('uh-oh! ' + error);
                return;
            }
            // Make a request
            console.log('sending Molang request to ' + url)
            return request.get(url + 'api/light/off/').then(
                (response) => {
                    that.emit(':tellWithCard', 'Molang is off', SKILL_NAME, 'Thanks')
                    console.log(response);
                },
                (error) => {
                    that.emit(':tellWithCard', 'Sorry, Something went wrong when I tried turn off Molang', SKILL_NAME, 'Something went wrong')
                    console.error('uh-oh! ' + error);
                }
            );
        });
    },
    'MolangColor': function (color) {
        var that = this
        getUrl('3rd', (url, error) => {
            if (error) {
                that.emit(':tellWithCard', 'Sorry, something went wrong when I tried to turn color of Molang', SKILL_NAME, 'Something went wrong')
                console.error('uh-oh! ' + error);
                return;
            }
            // Make a request
            console.log(color + ' sending Molang request to ' + url) 
            // TODO color
            return request.get(url + 'api/light/color/' + color.toUpperCase().charAt(0) + '/' ).then(
                (response) => {
                    that.emit(':tellWithCard', 'Molang turn to ' + color +' color', SKILL_NAME, 'Thanks')
                    console.log(response);
                },
                (error) => {
                    that.emit(':tellWithCard', 'Sorry, Something went wrong when I tried turn color of Molang', SKILL_NAME, 'Something went wrong')
                    console.error('uh-oh! ' + error);
                }
            );
        });
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = "You can say turn on AC, or, you can say exit... What can I help you with?";
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

var getUrl = function (location, postback) {
    var params = {
        TableName : 'prod_ac_public_url',
        ProjectionExpression: '#loc, public_url',
        FilterExpression: '#loc = :val',
        ExpressionAttributeNames:{
            '#loc': 'location'
        },
        ExpressionAttributeValues: {
            ':val': location
        }
    };

    var onScan = function (err, data) {
        if (err) {
            console.error('Unable to scan. Error:', JSON.stringify(err, null, 2));
            return postback(false, err);
        }
        console.log('Scan succeeded.');
        data.Items.forEach(function(item) {
            postback(item.public_url, false); // TODO we need to send one success message for each AC operation in a location
        });
        // continue scanning if we have more rows, because
        // scan can retrieve a maximum of 1MB of data
        if (typeof data.LastEvaluatedKey != 'undefined') {
            console.log("Scanning for more...");
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params, onScan);
        }
        console.log('Scan done.');
    };

    docClient.scan(params, onScan);
};