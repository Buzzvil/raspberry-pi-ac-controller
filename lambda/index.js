'use strict';
var AWS = require("aws-sdk");
var Alexa = require('alexa-sdk');
var Promise = require('bluebird');
var request = require('request-promise');

var APP_ID = undefined; //OPTIONAL: replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
var SKILL_NAME = 'pi';
AWS.config.update({
  region: 'us-east-1',
  endpoint: 'https://dynamodb.us-east-1.amazonaws.com'
});
AWS.config.setPromisesDependency(require('bluebird'));
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
        var that = this;
        return sendRequest('3rd', '/api/ac/on/')
            .then(() => {
                that.emit(':tellWithCard', 'All 3rd floor AC are on!', SKILL_NAME, 'Thanks');
            })
            .catch((error) => {
                that.emit(':tellWithCard', 'Sorry, Something went wrong when I tried turn on the ac', SKILL_NAME, 'Something went wrong');
                console.error('uh-oh! ' + error);
            });
    },
    'ACTurnOff': function () {
        var that = this;
        return sendRequest('3rd', '/api/ac/off/')
            .then(() => {
                that.emit(':tellWithCard', 'All 3rd floor AC are off!', SKILL_NAME, 'Thanks');
            })
            .catch((error) => {
                that.emit(':tellWithCard', 'Sorry, Something went wrong when I tried turn off the ac', SKILL_NAME, 'Something went wrong');
                console.error('uh-oh! ' + error);
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
        var that = this;
        return sendRequest('3rd', '/api/light/on/')
            .then(() => {
                that.emit(':tellWithCard', 'Molang is on', SKILL_NAME, 'Thanks');
            })
            .catch((error) => {
                that.emit(':tellWithCard', 'Sorry, Something went wrong when I tried turn on Molang', SKILL_NAME, 'Something went wrong');
                console.error('uh-oh! ' + error);
            });
    },
    'MolangTurnOff': function () {
        var that = this;
        return sendRequest('3rd', '/api/light/off/')
            .then(() => {
                that.emit(':tellWithCard', 'Molang is off', SKILL_NAME, 'Thanks');
            })
            .catch((error) => {
                that.emit(':tellWithCard', 'Sorry, Something went wrong when I tried turn off Molang', SKILL_NAME, 'Something went wrong');
                console.error('uh-oh! ' + error);
            });
    },
    'MolangColor': function (color) {
        var that = this;
        return sendRequest('3rd', '/api/light/color/' + color.charAt(0))
            .then(() => {
                that.emit(':tellWithCard', 'Molang turn to ' + color +' color', SKILL_NAME, 'Thanks');
            })
            .catch((error) => {
                that.emit(':tellWithCard', 'Sorry, Something went wrong when I tried turn color of Molang', SKILL_NAME, 'Something went wrong');
                console.error('uh-oh! ' + error);
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

var getUrl = function (location) {
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

    var onScan = function (data) {
        console.log('Scan succeeded.');
        var urls = data.Items.map((item) => {
            return item.public_url;
        });
        // continue scanning if we have more rows, because
        // scan can retrieve a maximum of 1MB of data
        if (typeof data.LastEvaluatedKey != 'undefined') {
            console.log("Scanning for more...");
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            return docClient.scan(params).promise()
                .then(onScan)
                .then((_urls) => {
                    return urls.concat(_urls);
                });
        }
        console.log('Scan done.');
        return urls;
    };

    return docClient.scan(params).promise()
        .then(onScan);
};

var sendRequest = function(floor, api) {
    return getUrl(floor)
            .then((urls) => {
                // send signal for all urls
                var requestPromises = urls.map((url) => {
                    console.log('preparing request to ' + url);
                    return request.get(url + api)
                        .catch((error) => {
                            console.error('uh-oh! ' + error);
                            return false; // flag
                        });
                });
                console.log('sending requests');
                return Promise.all(requestPromises);
            })
            .then((responses) => {
                var success = false;
                responses.forEach(function(resp) {
                    success = success || resp
                });
                if (!success) {
                    throw 'No device responded!';
                }
                return true;
            });
};