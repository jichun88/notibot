<?php
// Required if your envrionment does not handle autoloading
require __DIR__ . '/vendor/autoload.php';

// Use the REST API Client to make requests to the Twilio REST API
use Twilio\Rest\Client;
function send_msg($summary, $to_place, $when, $rtime, $number){
// Your Account SID and Auth Token from twilio.com/console
$sid = "SID"; // Your Account SID from www.twilio.com/console
$token = "Token"; // Your Auth Token from www.twilio.com/console
$client = new Client($sid, $token);
echo $rtime;
$time = date("H:i", time() + intval($rtime));

	// Use the client to do fun stuff like send text messages!
	$client->messages->create(
		// the number you'd like to send the message to
		$number,
		array(
			// A Twilio phone number you purchased at twilio.com/console
			 'from' => 'MYNUMBER', 
			// the body of the text message you'd like to send
			//'body' => 'leaving now from '.$to_place.'. I may arrive at '.$time
			'body' => 'sorry, I will just arrive at '.$time
		)
	);
}