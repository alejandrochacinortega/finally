angular.module('App', ['ngMaterial']);
angular
    .module('App')
    .controller('MainController', ['$scope', MainController]);

    function MainController($scope) {
        var vm = this;

        console.log('This is the HelloController');
        vm.title = 'MainController';
        console.log('vm.app FIRST', vm.app);

        vm.click = click;

        vm.app = {};

        vm.app.user = 'evo1234567';

        /** Default light. */
        vm.app.lightId = 1;

        /** IP-address of the Hue Bridge. */
        vm.app.bridgeIP = null;

        /**
         * Define colors that the lights can be configured with.
         * The colour buttons are set to these colours.
         */
        /*{'hue':1000,  'bri':75, 'sat':250},
         {'hue':10000, 'bri':75, 'sat':250},
         {'hue':30000, 'bri':75, 'sat':250}*/
        vm.app.hueColors = [
            {
                'hue': 10,
                'bri': 75,
                'sat': 250
            },
            {
                'hue': 200,
                'bri': 25,
                'sat': 50
            },
            {
                'hue': 200,
                'bri': 45,
                'sat': 150
            }
        ];


        /*LIGHT ONE OBJECT*/

        vm.lightOne= {
            show: true
        };

        vm.lightOne.color = {
            hue: Math.floor(Math.random() * 255),
            bri: Math.floor(Math.random() * 255),
            sat: Math.floor(Math.random() * 255)
        };


        /*LIGHT TWOOBJECT*/

        vm.lightTwo= {
            show: false
        };

        vm.lightTwo.color = {
            hue: Math.floor(Math.random() * 255),
            bri: Math.floor(Math.random() * 255),
            sat: Math.floor(Math.random() * 255)
        };

        /*LIGHT THREE OBJECT*/


        vm.lightThree= {
            show: false
        };

        vm.lightThree.color = {
            hue: Math.floor(Math.random() * 255),
            bri: Math.floor(Math.random() * 255),
            sat: Math.floor(Math.random() * 255)
        };


        activate();

        /*-------------------------------------------------*/

        function click() {
            console.log('It works!');
        }

        function activate () {
            console.log('I am activated');
            $(function()
            {
                // Display the selected default light.
                $('#lightButton' + vm.app.lightId).prop('checked', true);
            });

            vm.app.getHueBridgeIpAddress = function()
            {
                return app.bridgeIP || $('#HueBridgeIpAddress').val();
            };

            /**
             * Store the Hue Bridge IP and update the UI's text field.
             */
            vm.app.setHueBridgeIpAddress = function(ipAddress)
            {
                vm.app.bridgeIP = ipAddress;
                $('#HueBridgeIpAddress').val(vm.app.bridgeIP);
            };

            vm.app.connectAuto = function()
            {
                console.log('Welcome here!');
                // Try to find the local IP address of the Hue Bridge
                // and determine whether we are already authorized to
                // control its lights.
                vm.app.fetchBridgeIP(
                    function(ipaddress)
                    {
                        vm.app.setHueBridgeIpAddress(ipaddress);
                        vm.app.connect();
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
            vm.app.connectToIP = function()
            {
                vm.app.connect();
            };

            /**
             * Get the local IP address of the Hue Bridge.
             */
            vm.app.fetchBridgeIP = function(successFun, failFun)
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
            vm.app.checkConnection = function(successFun, failFun)
            {
                $.ajax({
                    type: 'GET',
                    dataType: 'json',
                    url: 'http://' +
                    vm.app.getHueBridgeIpAddress() +'/api/' +
                    vm.app.user + '/config',
                    success: successFun,
                    error: function(a, err) { failFun(err) }
                });
            };

            /**
             * Connect to the Hue Bridge by registering the user.
             */
            vm.app.connect = function()
            {
                $('#status').html('Connecting...');
                vm.app.registerUser(
                    vm.app.user,
                    function(json)
                    {
                        json[0].error.description = "Connected";
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
            vm.app.registerUser = function(userName, successFun, failFun)
            {
                var data = {"devicetype":"test user", "username":userName}
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    timeout: 3000,
                    url: 'http://' + vm.app.getHueBridgeIpAddress() +'/api/',
                    data: JSON.stringify(data),
                    success: function(data) { successFun(data) },
                    error: function(a, err) { failFun(err) }
                });
            };


            vm.app.selectLight = function(lightId)
            {
                vm.app.lightId = lightId;

                switch (vm.app.lightId) {
                    case 1:
                        vm.lightOne.show = true;
                        vm.lightTwo.show = false;
                        vm.lightThree.show = false;
                        /*vm.app.hueColors[1] = vm.lightTwo.color;
                        vm.app.lightSetState(vm.app.lightId, vm.app.hueColors[1]);
                        console.log('vm.app.hueColors', vm.app.hueColors)
                        console.log('vm.color', vm.color)
                        vm.app.lightSetState(vm.app.lightId, vm.color);
                        console.log('vm.lightOne.show ', vm.lightOne.show);
                        console.log('vm.lightTwo.show ', vm.lightTwo.show);*/
                        break;

                    case 2:
                        vm.lightOne.show = false;
                        vm.lightTwo.show = true;
                        vm.lightThree.show = false;
                        break;

                    case 3:
                        vm.lightOne.show = false;
                        vm.lightTwo.show = false;
                        vm.lightThree.show = true;
                        break;

                }
            };


            vm.app.lightOn = function()
            {
                vm.app.lightSetState(vm.app.lightId, {"on":true});
            };

            vm.app.lightOff = function()
            {
                vm.app.lightSetState(vm.app.lightId, {"on":false});
            };

            vm.app.lightsSetColor1 = function()
            {
                vm.lightOne.show = true;
                vm.lightTwo.show = false;
                vm.app.hueColors[0] = vm.lightOne.color;
                vm.app.lightSetState(vm.app.lightId, vm.app.hueColors[0]);
                console.log('vm.app.hueColors', vm.app.hueColors);
                console.log('vm.color', vm.color)
            };

            vm.app.lightsSetColor2 = function()
            {
                vm.lightTwo.show = true;
                vm.lightOne.show = false;
                vm.app.hueColors[1] = vm.lightTwo.color;
                vm.app.lightSetState(vm.app.lightId, vm.app.hueColors[1]);
                console.log('vm.app.hueColors', vm.app.hueColors);
                console.log('vm.color', vm.color);
                vm.app.lightSetState(vm.app.lightId, vm.color);
                console.log('vm.lightOne.show ', vm.lightOne.show);
                console.log('vm.lightTwo.show ', vm.lightTwo.show)
            };

            vm.app.lightsSetColor3 = function()
            {
                console.log('You are clicking me!');
                vm.lightOne.show = false;
                vm.lightTwo.show = false;
                vm.lightThree.show = true;
                vm.app.hueColors[2] = vm.lightTwo.color;
                vm.app.lightSetState(vm.app.lightId, vm.app.hueColors[2]);
                console.log('vm.app.hueColors', vm.app.hueColors);
                console.log('vm.color', vm.color);
                vm.app.lightSetState(vm.app.lightId, vm.app.hueColors[2]);
                console.log('vm.lightOne.show ', vm.lightOne.show);
                console.log('vm.lightTwo.show ', vm.lightTwo.show)
                console.log('vm.lightThree.show ', vm.lightThree.show)
            };

            vm.app.lightsEffectOn = function()
            {
                vm.app.lightSetState(vm.app.lightId, {"effect":"colorloop"});
            };

            vm.app.lightsEffectOff = function()
            {
                vm.app.lightSetState(vm.app.lightId, {"effect":"none"});
            };

            /**
             * Sets a light's state by sending a request to the Hue Bridge.
             */
            vm.app.lightSetState = function(lightId, state)
            {
                $.ajax({
                    type: 'PUT',
                    dataType: 'json',
                    url: 'http://' + vm.app.getHueBridgeIpAddress() +'/api/' +
                    vm.app.user + '/lights/' + lightId + '/state',
                    data: JSON.stringify(state),
                    success: function(data) { },
                    error: function(a, err) { }
                });
            };


            console.log('vm.app END', vm.app);
            console.log('vm.app test', vm.app.getHueBridgeIpAddress());

        }






}

