/**
*   
*   File: DoNS-Email.groovy
*   Platform: Hubitat
*   Modification History:
*   		Date        	Time	Who		What
*   		2018-11-27 		erktrek		Used Dan Ogorchock's pushover DTH for Hubitat HE as a template.
*   		2018-11-28	10:04	erktrek		Added ability to use single message / to in device.
*       v1.1.0	2018-11-28	12:05	erktrek		Added bypass to try/catch error if message is "OK"
*									tweaked version to fit work a bit better.
*       v1.2.0	2019-01-31	08:54	erktrek		Changed call to async for better system performance, tweaked subject to display blank instead of null
*       v1.2.1	2019-03-25	07:57	erktrek		Minor bug fix, removed "null" subject display for preconfigured email devices.
*       v2.0.0	2019-08-06	22:31	erktrek		Added Google, smtp and SMTPS transports.
*       v2.1.0	2019-08-07	08:02	erktrek		Moved auth password to eml_config.js on server. 
*       v2.1.1	2019-08-07	16:00	erktrek		Updated to add state variable authusers, fixed some bugs re:dup submit 
*       v2.1.2	2019-08-08	07:00	erktrek		Moved both authuser and authpwd to eml_config.js file, lookup based on From user. 
*       v2.1.3	2019-08-09	08:00	erktrek		Changed state variable authusers to StoredFromAddrs for clarity
*       v3.0.0	2022-08-01	14:25	erktrek		Updated nodemailer to remove vulnerability, removed node_modules dir, those need to be 
*							installed via npm, added exec capability.
*
*  Copyright 2022 erktrek
*
*  Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
*  in compliance with the License. You may obtain a copy of the License at:
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed
*  on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License
*  for the specific language governing permissions and limitations under the License.
*
*
*/
def version() {"v3.0.0"}

preferences {
	input("DoNSUrl", "text", title: "DoNetStuff Email URL:", description: "[ip address][:port]/email")
	input(name: "service", defaultValue: "sendmail", type: "enum", title: "Service", options: ["sendmail","google","smtps (587)"])

	input("server", "text", title: "Server:", description: "email server, okay to leave blank for google/sendmail)")
	//input("authuser", "text", title: "Auth User:", description: "")
	//input("authpwd", "text", title: "Auth Password:", description: "")
	
	input("From", "text", title: "From:", description: "")
	input("To", "text", title: "To:", description: "")
	input("Subject", "text", title: "Subject:", description: "")
}

metadata {
	definition (
		name: "DoNS-Email", 
		namespace: "adsavia", 
		author: "erktrekuebl"
	)
	{
        	capability "Notification"
        	capability "Actuator"
		//attribute "FromServer", "string"
    	}
}

def installed() {
    initialize()
}

def updated() {
    initialize()   
}

def initialize() {
	//unschedule()
	state.clear()
    state.version = version()
	setAllowedEmailList()
}

def setAllowedEmailList() {
	emlList = asynchttpGet('httpGetEmlList'
	,[
		uri: "${DoNSUrl}",
		contentType: "application/json",
		requestContentType: 'application/json',			
	]);
}

def httpGetEmlList(response, data) {
  state.StoredFromAddrs = parseJson(response.data).AllowedAddrs
}

def deviceNotification(message) {

	def msg = "${message}"
	def emlFrom = "${From}"
	def emlText = ""
	def emlSubject = ""
	def emlTo = ""
	def postBody = []
	
	if(msg.substring(0,1) == "{") {
		// Parse out message for from/to/subject/text
		def slurper = new groovy.json.JsonSlurper()
		def result = slurper.parseText(msg)
		emlText = result.Text
		emlSubject = (result.Subject != null ? result.Subject : "")
		emlTo = result.To
		
	} else {
		emlText = msg
		emlSubject = (Subject != null ? "${Subject}" : "")
		emlTo = "${To}"
	}

	try {
		// Define the initial postBody
		postBody = [
			From: emlFrom
			,To: emlTo
			,Subject: emlSubject,
			,Text: emlText
			,service: "${service}"
			,server: "${server}"
			//,authuser: "${authuser}"
			//,authpwd: "${authpwd}"
		]

		// Prepare the package to be sent
		def params = [
			uri: "${DoNSUrl}/email",
			contentType: "application/json",
			//requestContentType: "application/x-www-form-urlencoded",
			requestContentType: 'application/json',			
			body: postBody
		]
		asynchttpPost('httpCallback', params, [success: true])

	} catch(Exception e) {
		if(e.message.toString() != "OK"){
			log.error e.message
		}
	}

}

def httpCallback(response, data) {
	if(data["success"]==true){
    	log.debug "data was passed successfully"
	}
    log.debug "status of post call is: ${response.status}"
}
