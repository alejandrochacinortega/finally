angular
    .module('App')
    .factory('GoogleCalendarService', ['$q', GoogleCalendarService]);

/*GoogleCalendarService.$inject = [''];*/

/* @ngInject */
function GoogleCalendarService($q) {
    var service = {
        getData: getData
    };

    return service;

    ////////////////

    function getData() {
            var config = {
                'client_id': '435124131375-571j8bianm4e2rlp5ib5qicj3p54l0hm.apps.googleusercontent.com',
                'scope': 'https://www.googleapis.com/auth/calendar'

            };
            gapi.auth.authorize(config, function() {
                console.log('login complete');
                //console.log(gapi.auth.getToken());

            });

            apiCall();

            // Internal functions

            function apiCall() {
                console.log('inside apiCall');
                gapi.client.load('calendar','v3',function(){
                    var request = gapi.client.calendar.events.list({
                        'calendarId': 'omar@centerattn.com'
                    });
                    request.execute(function(resp) {
                        /*console.log('resp ', resp.items);*/
                        for (var i=0; i<resp.items.length; i++){
                            console.log('time ', resp.items[i].start.dateTime);
                            /*console.log('Summary ', resp.items[i].summary);*/
                            console.log('timeZone ', resp.items[i].start.timeZone);
                        }

                    });
                });
            }

    }


}
