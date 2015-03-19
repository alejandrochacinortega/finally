/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var googleapi = {
    authorize: function(options) {
        var deferred = $.Deferred();

        //Build the OAuth consent page URL
        var authUrl = 'https://accounts.google.com/o/oauth2/auth?' + $.param({
                client_id: options.client_id,
                redirect_uri: options.redirect_uri,
                response_type: 'code',
                scope: options.scope
            });

        //Open the OAuth consent page in the InAppBrowser
        var authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no');

        //The recommendation is to use the redirect_uri "urn:ietf:wg:oauth:2.0:oob"
        //which sets the authorization code in the browser's title. However, we can't
        //access the title of the InAppBrowser.
        //
        //Instead, we pass a bogus redirect_uri of "http://localhost", which means the
        //authorization code will get set in the url. We can access the url in the
        //loadstart and loadstop events. So if we bind the loadstart event, we can
        //find the authorization code and close the InAppBrowser after the user
        //has granted us access to their data.
        $(authWindow).on('loadstart', function(e) {
            var url = e.originalEvent.url;
            var code = /\?code=(.+)$/.exec(url);
            var error = /\?error=(.+)$/.exec(url);

            if (code || error) {
                //Always close the browser when match is found
                authWindow.close();
            }

            if (code) {
                //Exchange the authorization code for an access token
                $.post('https://accounts.google.com/o/oauth2/token', {
                    code: code[1],
                    client_id: options.client_id,
                    client_secret: options.client_secret,
                    redirect_uri: options.redirect_uri,
                    grant_type: 'authorization_code'
                }).done(function(data) {
                    deferred.resolve(data);
                }).fail(function(response) {
                    deferred.reject(response.responseJSON);
                });
            } else if (error) {
                //The user denied access to the app
                deferred.reject({
                    error: error[1]
                });
            }
        });

        return deferred.promise();
    }
};


var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);

        var $loginButton = $('#login a');
        var $loginStatus = $('#login p');

        $loginButton.on('click', function() {
            googleapi.authorize({
                client_id: '435124131375-l0eg7gvo10843ctav97819um725but2a.apps.googleusercontent.com',
                redirect_uri: 'http://localhost',
                /*scope: 'https://www.googleapis.com/auth/analytics.readonly'*/
                scope: 'https://www.googleapis.com/auth/calendar'

            }).done(function(data) {
                $loginStatus.html('Access Token: ' + data.access_token);
            }).fail(function(data) {
                $loginStatus.html(data.error);
            });
        });
        var onShake = function () {
            // Code fired when a shake is detected
            console.log('You shake the phone!');
        };

// Start watching for shake gestures and call "onShake"
// with a shake sensitivity of 40 (optional, default 30)
        shake.startWatch(onShake, 40);

// Stop watching for shake gestures
        shake.stopWatch();
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();


// JavaScript code for the "Philips Hue Demo" example app.
/** Application object. */
var app = {};

/** User name (you can change this, must be at least 10 characters). */
app.user = 'evo1234567';

/** Default light. */
app.lightId = 1;

/** IP-address of the Hue Bridge. */
app.bridgeIP = null;

/**
 * Define colors that the lights can be configured with.
 * The colour buttons are set to these colours.
 */
app.hueColors = [
    {'hue':1000,  'bri':75, 'sat':250},
    {'hue':10000, 'bri':75, 'sat':250},
    {'hue':30000, 'bri':75, 'sat':250}
];

/**
 * Called when the page has finished loading.
 */
$(function()
{
    // Display the selected default light.
    $('#lightButton' + app.lightId).prop('checked', true);
});

/**
 * You can manually lookup the ip-address of the Hue Bridge
 * using these commands (ping detectes the Hue Bridge):
 *   ping 255.255.255.255
 * followed by (arp lists detected clients):
 *   arp -a
 * Look at the MAC-address under the Hue Bridge and find the
 * matching ip-address in the arp listing.
 */
app.getHueBridgeIpAddress = function()
{
    return app.bridgeIP || $('#HueBridgeIpAddress').val();
};

/**
 * Store the Hue Bridge IP and update the UI's text field.
 */
app.setHueBridgeIpAddress = function(ipAddress)
{
    app.bridgeIP = ipAddress;
    $('#HueBridgeIpAddress').val(app.bridgeIP);
};

/**
 * Auto Connect button handler.
 */
app.connectAuto = function()
{
    console.log('Welcome here!');
    // Try to find the local IP address of the Hue Bridge
    // and determine whether we are already authorized to
    // control its lights.
    app.fetchBridgeIP(
        function(ipaddress)
        {
            app.setHueBridgeIpAddress(ipaddress);
            app.connect();
            console.log('app.js file');

            // Not used.
            /*app.checkConnection(
             function()
             {
             // If the connection test passes, update the UI
             // to show that we are connected to the Hue Bridge.
             $('#status').html('Connected');
             },
             function() { });*/
        });
};

/**
 * Connect to IP button handler.
 */
app.connectToIP = function()
{
    app.connect();
};

/**
 * Get the local IP address of the Hue Bridge.
 */
app.fetchBridgeIP = function(successFun, failFun)
{
    $.getJSON('https://www.meethue.com/api/nupnp', function(data)
    {
        if (data[0] && data[0].hasOwnProperty('internalipaddress'))
        {
            successFun && successFun(data[0].internalipaddress);
        }
        else
        {
            failFun && failFun('Could not find ipaddress');
        }
    }).fail(failFun);
};

/**
 * Tests the connection to the Hue Bridge by sending a request to it.
 */
app.checkConnection = function(successFun, failFun)
{
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'http://' +
        app.getHueBridgeIpAddress() +'/api/' +
        app.user + '/config',
        success: successFun,
        error: function(a, err) { failFun(err) }
    });
};

/**
 * Connect to the Hue Bridge by registering the user.
 */
app.connect = function()
{
    $('#status').html('Connecting...');
    app.registerUser(
        app.user,
        function(json)
        {
            console.log(json[0]);
            if (json[0].error)
            {
                $('#status').html(json[0].error.description);
            }
            else if (json[0].success)
            {
                $('#status').html('Connected');
            }
            else
            {
                $('#status').html('Something went wrong');
            }
        },
        function()
        {
            $('#status').html('Could not find Hue Bridge');
        });
};

/**
 * Sends an authorization request to the Hue Bridge.
 */
app.registerUser = function(userName, successFun, failFun)
{
    var data = {"devicetype":"test user", "username":userName}
    $.ajax({
        type: 'POST',
        dataType: 'json',
        timeout: 3000,
        url: 'http://' + app.getHueBridgeIpAddress() +'/api/',
        data: JSON.stringify(data),
        success: function(data) { successFun(data) },
        error: function(a, err) { failFun(err) }
    });
};

app.selectLight = function(lightId)
{
    app.lightId = lightId;
};

app.lightOn = function()
{
    app.lightSetState(app.lightId, {"on":true});
};

app.lightOff = function()
{
    app.lightSetState(app.lightId, {"on":false});
};

app.lightsSetColor1 = function()
{
    app.lightSetState(app.lightId, app.hueColors[0]);
};

app.lightsSetColor2 = function()
{
    app.lightSetState(app.lightId, app.hueColors[1]);
};

app.lightsSetColor3 = function()
{
    app.lightSetState(app.lightId, app.hueColors[2]);
};

app.lightsEffectOn = function()
{
    app.lightSetState(app.lightId, {"effect":"colorloop"});
};

app.lightsEffectOff = function()
{
    app.lightSetState(app.lightId, {"effect":"none"});
};

/**
 * Sets a light's state by sending a request to the Hue Bridge.
 */
app.lightSetState = function(lightId, state)
{
    $.ajax({
        type: 'PUT',
        dataType: 'json',
        url: 'http://' + app.getHueBridgeIpAddress() +'/api/' +
        app.user + '/lights/' + lightId + '/state',
        data: JSON.stringify(state),
        success: function(data) { },
        error: function(a, err) { }
    });
};


