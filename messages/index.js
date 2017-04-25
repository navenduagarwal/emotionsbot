"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var express = require('express');
var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);

bot.dialog('/', function (session) {
    session.send('You said ' + session.message.text);
});

if (useEmulator) {
    var server = express();
    server.set('port',3978);
    server.listen(server.get('port'), function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
     // Setup Restify Server
    var server = express();
    server.set('port', process.env.port || process.env.PORT || 3978);
    server.listen(server.get('port'), function () {
        console.log('%s listening to %s',1,server.get('port'));
    });
    server.post('/api/messages', connector.listen());
    module.exports = { default: connector.listen() }
}
