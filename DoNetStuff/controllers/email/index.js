var nodemailer = require('nodemailer');

var tpInfo = {
	"sendmail": {
		sendmail: true,
		newline: 'unix',
		path: '/usr/sbin/sendmail'
	}
	, "google": {
	    host: 'smtp.gmail.com',
		port: 465,
		secure: true, // use SSL
		auth: {
			user: '',
			pass: ''
		}
	}
	, "smtp": {
		host: '',
		port: 22,
		secure: false, // true for 465, false for other ports
		auth: {
		  user: '', // generated ethereal user
		  pass: '' // generated ethereal password
		}
	}
	, "smtps": {
		host: '',
		port: 587,
		secureConnection: true, // true for 465, false for other ports
		auth: {
		  user: '', // generated ethereal user
		  pass: '' // generated ethereal password
		},
		tls: {
				rejectUnauthorized: false
				,ciphers:'SSLv3'
		}
	}
}

/*
var transporter = nodemailer.createTransport({
    sendmail: true,
    newline: 'unix',
    path: '/usr/sbin/sendmail'
});
*/

module.exports = function(router){
	
	
	router.post('/', function (req, res) {
		var eml = req.body
		
		//console.log(req.body);
		var tp = tpInfo[eml.service];

		var mailInfo = {};
		switch (eml.service) {
			case "google":
				// tp.service = eml.service;
				tp.auth.user = eml.authuser;
				tp.auth.pass = eml.authpwd;
				
				mailInfo = {
					from: eml.From,
					to: eml.To,
					subject: eml.Subject,
					text: eml.Text,
				};
				break;
				
			case "smtp":
				tp.server = eml.server;
				tp.auth.user = eml.authuser;
				tp.auth.pass = eml.authpwd;
			
				mailInfo = {
					host: eml.server,
					port: 587,
					secure: false, 
					auth: {
						user: eml.authuser, // generated ethereal user
						pass: eml.authpwd // generated ethereal password
					}
				}
				break;
			case "smtps":
				tp.host = eml.server;
				tp.auth.user = eml.authuser;
				tp.auth.pass = eml.authpwd;
				
				mailInfo = {
					from: eml.From,
					to: eml.To,
					subject: eml.Subject,
					text: eml.Text,
				}
				break;
			default:
				mailInfo = {
					from: eml.From,
					to: eml.To,
					subject: eml.Subject,
					text: eml.Text,
				}
		}
		
		console.log('----------------');
		console.log(tp);
		console.log('================');
		console.log(mailInfo);
		
		var transport = nodemailer.createTransport(
			tp
		);
		
		transport.sendMail(mailInfo, (error) => {
			if (error) {
				console.log(error);
			}
		});
		
		transport.sendMail(tp, (err, info) => {
			//console.log(info);
			//console.log(info.envelope);
			//console.log(info.messageId);
		});		
		

	/*
		transporter.sendMail({
			from: eml.From,
			to: eml.To,
			subject: eml.Subject,
			text: eml.Text,
		}, (err, info) => {
			//console.log(info.envelope);
			//console.log(info.messageId);
		});		
	*/	
        res.end('Email Sent!');
    });


};
