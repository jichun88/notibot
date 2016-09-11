      // Your Client ID can be retrieved from your project in the Google
      // Developer Console, https://console.developers.google.com
      var CLIENT_ID = 'CLIENT_ID';

      var SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

      /**
       * Check if current user has authorized this application.
       */
      function checkAuth() {
        gapi.auth.authorize(
          {
            'client_id': CLIENT_ID,
            'scope': SCOPES.join(' '),
            'immediate': true
          }, handleAuthResult);
      }

      /**
       * Handle response from authorization server.
       *
       * @param {Object} authResult Authorization result.
       */
      function handleAuthResult(authResult) {
        var authorizeDiv = document.getElementById('authorize-div');
        if (authResult && !authResult.error) {
          // Hide auth UI, then load client library.
          authorizeDiv.style.display = 'none';
          loadCalendarApi();
        } else {
          // Show auth UI, allowing the user to initiate authorization by
          // clicking authorize button.
          authorizeDiv.style.display = 'inline';
        }
      }

      /**
       * Initiate auth flow in response to user clicking authorize button.
       *
       * @param {Event} event Button click event.
       */
      function handleAuthClick(event) {
        gapi.auth.authorize(
          {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
          handleAuthResult);
        return false;
      }

      /**
       * Load Google Calendar client library. List upcoming events
       * once client library is loaded.
       */
      function loadCalendarApi() {
        gapi.client.load('calendar', 'v3', listUpcomingEvents);
      }

      /**
       * Print the summary and start datetime/date of the next ten events in
       * the authorized user's calendar. If no events are found an
       * appropriate message is printed.
       */
      function listUpcomingEvents() {
        var request = gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
          'orderBy': 'startTime'
        });

        request.execute(function(resp) {
          var events = resp.items;
         // appendPre('Upcoming events:');

          if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
              var event = events[i];
				var summary = event.summary;
              var when = event.start.dateTime;
              if (!when) {
                when = event.start.date;
              }
			  
			  var to_place = event.location;
			  if(to_place){
				get_traffice_time(to_place, when, summary);
			  }
             // appendPre(event.summary + ' (' + when + ')')
			 appendPre("it's Done")
            }
          } else {
            appendPre('No upcoming events found.');
          }

        });
      }
	
      /**
       * Append a pre element to the body containing the given message
       * as its text node.
       *
       * @param {string} message Text to be placed in pre element.
       */




 

      function appendPre(message) {
        var pre = document.getElementById('output');
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
      }
		
	  function get_traffice_time(to_place, when, summary){
		  var from_place ="37.7756433,-122.3889319"//pier48;
		 // var to_place = "39.743943,  -105.020089"
		  console.log(to_place);
			var data_body = '[ "37.7756433,-122.3889319", "'+to_place+'"  ]';
		//	console.log("http://www.mapquestapi.com/directions/v2/route?key=KEY&from="+from_place+"&to="+to_place);
			
			 jQuery.ajax({
				   type:"POST",
				   data: "{ locations:"+ data_body+" }",
				   url:"http://www.mapquestapi.com/directions/v2/route?key=KEY",
					contentType:"application/json; charset=UTF-8",
				   dataType:"JSON", // 옵션이므로 JSON으로 받을게 아니면 안써도 됨
				   success : function(data) {
						 // 통신이 성공적으로 이루어졌을 때 이 함수를 타게 된다.
						 // TODO
						 console.log(to_place);
						 //console.log(data);
						 //distance time
						 console.log(data.route);
						send_socket(summary, to_place, when, data.route.time, data.route.realTime);
				   },
				   complete : function(data) {
						 // 통신이 실패했어도 완료가 되었을 때 이 함수를 타게 된다.
						 // TODO
				   },
				   error : function(xhr, status, error) {
						 alert("error");
				   }
			 });


	  }

	  function send_socket(summary,to_place, when, time, rtime){
						//socket.io
					var socket = io.connect('http://ducksb.co:8080');
						socket.emit('my event', { my: summary+";"+to_place+";"+when+";"+time+";"+rtime });
						
					   //end socket io
	  }