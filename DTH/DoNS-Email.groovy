/**
*   
*   File: DoNS-Email.groovy
*   Platform: Hubitat
*   Modification History:
*       Date       Who              What
*       2018-11-27 Eric Huebl		Used Dan Ogorchock's pushover DTH for Hubitat HE as a template.
*
*  Copyright 2018 Eric Huebl
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
def version() {"v1.0.0"}

preferences {
	input("DoNSUrl", "text", title: "DoNetStuff Email URL:", description: "[ip address][:port]/email")
	input("From", "text", title: "From:", description: "")
}

metadata {
    definition (name: "DoNS-Email", namespace: "adsavia", author: "Eric Huebl") {
        capability "Notification"
        capability "Actuator"
    }
}

def installed() {
    initialize()
}

def updated() {
    initialize()   
}

def initialize() {
    state.version = version()
}

def deviceNotification(message) {

	// Parse out message for from/to/subject/text
	def slurper = new groovy.json.JsonSlurper()
	def result = slurper.parseText("${message}")
	
	try {
	
		def emlText = result.Text
		def emlSubject = result.Subject
		def emlTo = result.To
		def emlFrom = "${From}"

		
		
		// Define the initial postBody
		def postBody = [
			From: emlFrom
			,To: emlTo
			,Subject: emlSubject,
			,Text: emlText
		]

		// Prepare the package to be sent
		def params = [
			uri: "${DoNSUrl}",
			contentType: "application/json",
			requestContentType: "application/x-www-form-urlencoded",
			body: postBody
		]

		httpPost(params){response ->
			if(response.status != 200) {
				log.error "Received HTTP error ${response.status}"
			}
			else {
				log.debug "Message Received"
			}
		}
	} catch(Exception e) {
		log.error e.message
		log.error "Problem parsing notification text: ${message}, should be in JSON format with To, Subject, Text elements defined."
	}
}