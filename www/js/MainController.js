angular
    .module('App')
    .controller('MainController', ['$scope', 'GoogleCalendarService', MainController]);

/*MainController.$inject = [''];*/

/* @ngInject */
function MainController($scope, GoogleCalendarService) {
    /* jshint validthis: true */
    var vm = this;

    vm.activate = activate;
    vm.title = 'MainController';
    vm.auth = auth;

    $scope.data = {
      'test': {
          'start': {
              dateTime: 'Datetime',
              timeZone: 'Timezone'
          }
      }
    };



    activate();

    ////////////////

    function activate() {
    }

    function auth() {
        var config = {
            'client_id': '435124131375-l0eg7gvo10843ctav97819um725but2a.apps.googleusercontent.com',
            'scope': 'https://www.googleapis.com/auth/calendar'

        };
        gapi.auth.authorize(config, function() {
            /*console.log('login complete');*/
            //console.log(gapi.auth.getToken());
            apiCall();
            return $scope.data;
        });


        // Internal functions

        function apiCall() {
            console.log('inside apiCall');
            gapi.client.load('calendar','v3',function(){
                var request = gapi.client.calendar.events.list({
                    'calendarId': 'testfornith@gmail.com'
                });
                request.execute(function(resp) {
                    console.log('resp ', resp.items);
                    $scope.data = resp.items;
                    /*console.log('vm.data ', vm.data);*/
                    if (resp.items.length == undefined) {
                        apiCall();
                    }

                    return $scope.data = resp.items;
                });
            });
        }
    }





}