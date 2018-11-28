# Hubitat-DoNS

#########################

UPDATE 11/28/18 - added feature to set subject/to in the device preferences and the message in the text notification box in your app/rule etc.

#########################

This is a very crude and as yet unsecured system for sending notifications from Hubitat using a simple DTH 
and a Node Server via a REST call.

To use install Node and copy over "DoNetStuff" directory - do the npm install thing etc etc.  Getting it running for
your setup is beyond the scope of my attention sadly.

On the Hubitate side, cut and paste (or import now I guess) the code from Groovy DTH located under DTH. Add a virtual device, 
set the proper Server URL - make sure to use port 3000 as it is the default AND ALSO THE "From" user..

You should then be able to use this device wherever notification is required.

In the Notify text field the data is entered thusly:

{"To":"Person1@SomeEmail.com,Person2@SomeOtherEmail.com","Subject":"Hope this works","Text":"This is the email body!"}

Suggestion for sms messages - each provider in the US at least has a way of emailing to txt messaging - 
For example Sprint uses "<phone#>@messaging.sprintpcs.com".. so something like "5551212@messaging.sprintpcs.com"

One last gotcha - make sure "node app.js" is actually running on your server and your firewall is not blocking things..
