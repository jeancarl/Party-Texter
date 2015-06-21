// Filename: server.js

// What port to listen to.
var port = 8080;

// PubNub Publish Key
var pubnub_publish_key = 'PUBLISHKEY';

// PubNub Subscribe Key
var pubnub_subscribe_key = 'SUBSCRIBEKEY';

/*********** End Configuration ***********/

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var pubnub = require('pubnub').init({
    publish_key: pubnub_publish_key,
    subscribe_key: pubnub_subscribe_key
});

app.use(bodyParser.json());
app.listen(port);

console.log("App listening on port "+port);

// Callback handler for Tropo service.
app.post('/api/sms', function(req, res) {
    pubnub.publish({
        channel: 'sms',
        message: {
            from: req.body.session.from.id,
            to: req.body.session.to.id,
            text: req.body.session.initialText
        }
    });

    res.end();
});

app.use(express.static(__dirname + '/public'));