'use strict';
var AWS = require('aws-sdk');
var Alexa = require('alexa-sdk');
var Promise = require('bluebird');
var request = require('request');
var qs = require('qs');

Promise.promisifyAll(request);

var APP_ID = undefined; //OPTIONAL: replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';
var SKILL_NAME = 'pi';
AWS.config.update({
  region: 'us-east-1',
  endpoint: 'https://dynamodb.us-east-1.amazonaws.com'
});
AWS.config.setPromisesDependency(require('bluebird'));
var docClient = new AWS.DynamoDB.DocumentClient();
var defaultSlackResponseType = 'in_channel';

exports.handler = function(event, context, callback) {
    if (event.postBody) {
        // slack request
        return slackHandler(event.postBody, callback);
    }
    // alexa request
    if (event.header.namespace == 'Alexa.ConnectedHome.Discovery') {
        return handleDiscovery(event, callback);
    }

    if (event.header.namespace == 'Alexa.ConnectedHome.Control') {
        return handleControl(event, callback);
    }
    // custom skill
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
        return sendRequest('3rd', '/api/light/color/' + color.toUpperCase().charAt(0))
            .then(() => {
                that.emit(':tellWithCard', 'Molang turn to ' + color +' color', SKILL_NAME, 'Thanks');
            })
            .catch((error) => {
                that.emit(':tellWithCard', 'Sorry, Something went wrong when I tried turn color of Molang', SKILL_NAME, 'Something went wrong');
                console.error('uh-oh! ' + error);
            });
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = 'You can say turn on AC, or, you can say exit... What can I help you with?';
        var reprompt = 'What can I help you with?';
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Goodbye!');
    }
};

var slackHandler = function(postBody, callback) {
    console.log('Got Slack event with ', postBody)
    // parse to json
    var body = qs.parse(postBody);
    // TODO validate token
    // if (body.token != 'FVt0A9tcrwyIip4tyKEWI2Zr') {
    //     console.log('Invalid token')
    //     return callback(null, {
    //         text: 'Invalid Token',
    //     });
    // }
    if (body.command === '/acon') {
        return sendRequest('3rd', '/api/ac/on/')
            .then(() => {
                callback(null, {
                    text: 'All 3rd floor AC are *on*!',
                    response_type: defaultSlackResponseType,
                });
            })
            .catch((error) => {
                callback(null, {
                    text: 'Sorry, Something went wrong when I tried turn on the ac',
                    response_type: defaultSlackResponseType,
                });
                console.error('uh-oh! ' + error);
            });
    }

    if (body.command === '/acoff') {
        return sendRequest('3rd', '/api/ac/off/')
            .then(() => {
                callback(null, {
                    text: 'All 3rd floor AC are *off*!',
                    response_type: defaultSlackResponseType,
                });
            })
            .catch((error) => {
                callback(null, {
                    text: 'Sorry, Something went wrong when I tried turn off the ac',
                    response_type: defaultSlackResponseType,
                });
                console.error('uh-oh! ' + error);
            });
    }

    if (body.command === '/achigh') {
        return sendRequest('3rd', '/api/ac/temp/high')
            .then(() => {
                callback(null, {
                    text: 'All 3rd floor AC are *set to high*!',
                    response_type: defaultSlackResponseType,
                });
            })
            .catch((error) => {
                callback(null, {
                    text: 'Sorry, Something went wrong',
                    response_type: defaultSlackResponseType,
                });
                console.error('uh-oh! ' + error);
            });
    }

    if (body.command === '/aclow') {
        return sendRequest('3rd', '/api/ac/temp/low')
            .then(() => {
                callback(null, {
                    text: 'All 3rd floor AC are *set to low*!',
                    response_type: defaultSlackResponseType,
                });
            })
            .catch((error) => {
                callback(null, {
                    text: 'Sorry, Something went wrong',
                    response_type: defaultSlackResponseType,
                });
                console.error('uh-oh! ' + error);
            });
    }

    if (body.command === '/acmedium') {
        return sendRequest('3rd', '/api/ac/temp/medium')
            .then(() => {
                callback(null, {
                    text: 'All 3rd floor AC are *set to medium*!',
                    response_type: defaultSlackResponseType,
                });
            })
            .catch((error) => {
                callback(null, {
                    text: 'Sorry, Something went wrong',
                    response_type: defaultSlackResponseType,
                });
                console.error('uh-oh! ' + error);
            });
    }

    if (body.command === '/lighton') {
        return sendRequest('3rd', '/api/light/on/')
            .then(() => {
                callback(null, {
                    text: 'The light is *on*!',
                    response_type: defaultSlackResponseType,
                });
            })
            .catch((error) => {
                callback(null, {
                    text: 'Sorry, Something went wrong when I tried turn on the light',
                    response_type: defaultSlackResponseType,
                });
                console.error('uh-oh! ' + error);
            });
    }

    if (body.command === '/lightoff') {
        return sendRequest('3rd', '/api/light/off/')
            .then(() => {
                callback(null, {
                    text: 'The light is *off*!',
                    response_type: defaultSlackResponseType,
                });
            })
            .catch((error) => {
                callback(null, {
                    text: 'Sorry, Something went wrong when I tried turn the light',
                    response_type: defaultSlackResponseType,
                });
                console.error('uh-oh! ' + error);
            });
    }

    if (body.command === '/lightcolor') {
        var color = body.text
        if (!color || !color.length) {
            return callback(null, {
                text: 'Invalid color! Please provide color *(red, green or blue)*',
            });
        }
        return sendRequest('3rd', '/api/light/color/' + color.toUpperCase().charAt(0))
            .then(() => {
                callback(null, {
                    text: 'Light turn to *' + color +'* color!',
                    response_type: defaultSlackResponseType,
                });
            })
            .catch((error) => {
                callback(null, {
                    text: 'Sorry, Something went wrong when I tried turn color of the light',
                    response_type: defaultSlackResponseType,
                });
                console.error('uh-oh! ' + error);
            });
    }

    return callback(null, {
        text: 'Try to send acon or acoff command!',
    });
}

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
            console.log('Scanning for more...');
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
                    return request.getAsync(url + api, {timeout: 10000}) 
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
                    console.log('Response status code ' + resp.statusCode)
                    success = success || resp.statusCode == 200
                });
                if (!success) {
                    throw 'No device responded 200!';
                }
                return true;
            });
};

var handleControl = function(event, callback) {
    var device_id = event.payload.appliance.applianceId;
    var message_id = event.header.messageId;
    var header = {
        'namespace':'Alexa.ConnectedHome.Control',
        'payloadVersion':'2',
        'messageId': message_id
    };

    if (event.header.name == 'TurnOnRequest') {
        return sendRequest('3rd', '/api/ac/on/')
            .then(() => {
                header.name = 'TurnOnConfirmation';
                callback(null, {
                    'header': header,
                    'payload': {}
                });
            })
            .catch((error) => {
                header.name = 'TargetOfflineError'
                callback(null, {
                    'header': header,
                    'payload': {}
                });
                console.error('uh-oh! ' + error);
            });;
    }

    if (event.header.name == 'TurnOffRequest') {
        return sendRequest('3rd', '/api/ac/off/')
            .then(() => {
                header.name = 'TurnOffConfirmation';
                callback(null, {
                    'header': header,
                    'payload': {}
                });
            })
            .catch((error) => {
                header.name = 'TargetOfflineError'
                callback(null, {
                    'header': header,
                    'payload': {}
                });
                console.error('uh-oh! ' + error);
            });
    }

    if (event.header.name == 'SetTargetTemperatureRequest') {
        var tempValue = event.payload.targetTemperature.value;
        var temp = 'low';
        if (tempValue < 19) {
            temp = 'high';
        } else if (tempValue < 25) {
            temp = 'medium';
        }
        return sendRequest('3rd', '/api/ac/temp/' + temp)
            .then(() => {
                header.name = 'SetTargetTemperatureConfirmation';
                callback(null, {
                    'header': header,
                    'payload': {
                        'targetTemperature': {
                            'value': tempValue
                        },
                        'temperatureMode': {
                            'value':'AUTO'
                        },
                        'previousState': {
                            'targetTemperature': {
                                'value': 21.0
                            },
                            'mode': {
                                'value': 'AUTO'
                            }
                        }
                    }
                });
            })
            .catch((error) => {
                header.name = 'TargetOfflineError'
                callback(null, {
                    'header': header,
                    'payload': {}
                });
                console.error('uh-oh! ' + error);
            });
    }
    // Unsupported Request
    header.name = 'UnsupportedOperationError'
    callback(null, {
        'header': header,
        'payload': {}
    });
}

var handleDiscovery = function(event, callback) {
    var header = {
        'namespace': 'Alexa.ConnectedHome.Discovery',
        'name': 'DiscoverAppliancesResponse',
        'payloadVersion': '2'
    };

    if (event.header.name == 'DiscoverAppliancesRequest') {
        payload = {
            'discoveredAppliances':[
                {
                    'applianceId':'device002',
                    'manufacturerName':'buzzvil',
                    'modelName':'model 01',
                    'version':'1',
                    'friendlyName':'AC',
                    'friendlyDescription':'Buzzvil 3rd floor AC',
                    'isReachable':true,
                    'actions':[
                        'turnOn',
                        'turnOff',
                        'setTargetTemperature'
                    ],
                    'applianceTypes':[
                        'THERMOSTAT'
                    ],
                    'additionalApplianceDetails':{
                        'extraDetail1':'optionalDetailForSkillAdapterToReferenceThisDevice',
                        'extraDetail2':'There can be multiple entries',
                        'extraDetail3':'but they should only be used for reference purposes.',
                        'extraDetail4':'This is not a suitable place to maintain current device state'
                    }
                }
            ]
        };
    }
    callback(null, {
        'header': header,
        'payload': payload || {}
    });
}