#########################################################
# Hubitat-DoNS
#########################################################

This is a basic system for providing notifications from the Hubitat Elevation to 
specific recipients via email. It can also be used for unlimited text notifications IF your
Phone provider offers an email to text email address. Note: most US providers DO..

#########################################################
### US Cell Providers "Email to Txt" Email Addresses
#########################################################
###### AT&T: {cell number}@txt.att.net (SMS), {cell number}@mms.att.net (MMS)
###### T-Mobile: {cell number}@tmomail.net (SMS & MMS)
###### Verizon: {cell number}@vtext.com (SMS), {cell number}@vzwpix.com (MMS)
###### Sprint: {cell number}@messaging.sprintpcs.com (SMS), {cell number}@pm.sprint.com (MMS)
###### XFinity Mobile: {cell number}@vtext.com (SMS), {cell number}@mypixmessages.com (MMS)
###### Virgin Mobile: {cell number}@vmobl.com (SMS), {cell number}@vmpix.com (MMS)
###### Tracfone: {cell number}@mmst5.tracfone.com (MMS)
###### Metro PCS: {cell number}@mymetropcs.com (SMS & MMS)
###### Boost Mobile: {cell number}@sms.myboostmobile.com (SMS), {cell number}@myboostmobile.com (MMS)
###### Cricket: {cell number}@sms.cricketwireless.net (SMS), {cell number}@mms.cricketwireless.net (MMS)
###### Republic Wireless: {cell number}@text.republicwireless.com (SMS)
###### Google Fi (Project Fi): {cell number}@msg.fi.google.com (SMS & MMS)
###### U.S. Cellular: {cell number}@email.uscc.net (SMS), {cell number}@mms.uscc.net (MMS)
###### Ting: {cell number}@message.ting.com
###### Consumer Cellular: {cell number}@mailmymobile.net
###### C-Spire: {cell number}@cspire1.com
###### Page Plus: {cell number}@vtext.com
#########################################################
#### The system works by installing by a custom device that communicates with a NodeJS via a REST call.
#### The server parses the request and sends it out via "sendmail".
#########################################################

##### Requirements:

Linux computer/server (like RaspberryPI) with Git, NodeJS, npm and sendmail installed.
Hubitat HE hub with the custom DoNS_Email device added to the "Drivers Code" section.

#########################################################

##### Simple installation instructions - your mileage may vary depending 
##### upon your system - I am using a Raspberry PI:

##### Linux Server side:
- As root clone this repo to a working directory (I used the PI's home directory).
- from a terminal, cd to the directory and run "npm install". This should install all the necessary components.
- if planning on using services requiring authorization (google/smtps) then edit the "eml_config.js"
  file and replace the placeholder entries with real ones.
- see if it runs via "node app.js"
- If so then you can you can add that to startup OR if using systemd see this:
https://github.com/adsavia/Hubitat-DoNS/tree/master/DoNetStuff/misc/systemd
Note: !!!! IF your directory is different you will have to edit the service file and change the locations.

##### HE side:
- From github view raw format for the https://github.com/adsavia/Hubitat-DoNS/blob/master/HE_Driver/DoNS-Email.groovy
- Cut and paste it into a new device in the drivers code section on your HE. Save

###### usage:

One HE device per email address!!
- Add new device, select "DoNS-Email" device. Label something like "DoNS-MyEmail" or "DoNS-MyPhone", save.
- Put the ip address/port (default 3000) of the node server you are running.
- In preferences fill in the "From:" and "To:" fields (multiple addresses separated by a comma), "Subject:" is optional..
- Select service (sendmail/google/"smtps (587)"). 

!!!!!!!!
If using something other than sendmail make sure you've created an eml_config.js file on the node server - see example file!!!
Also note that the "From" user is used as a lookup in the eml_config file and can be different from the authuser. No dup "From" users of course.
!!!!!!!!

- Save preferences. You should notice a new state variable called "authusers".
  these are the valid auth users you can use (that are stored in eml_config).
- To test enter a test message in "Device Notification" and click on the 
  Device Notification header. If everything is working you should recieve an 
  email with your test message and parameters you defined.
- Use device for any notifications you want!!!!!


