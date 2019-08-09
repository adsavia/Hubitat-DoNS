var nodemailer = require('nodemailer');
var emlCnf = require('../../eml_config');

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
	, "smtps (587)": {
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

	router.get('/', function (req, res) {
		var emls = [];
		for (let elem in emlCnf) {  
			console.log( elem );
			emls.push(elem);
		}
		res.send({ AllowedAddrs :emls} );
	});
	
	router.post('/', function (req, res) {
		var eml = req.body
		
		//console.log(req.body);
		var tp = tpInfo[eml.service];

		if (emlCnf[eml.From]) {
			var mailInfo = {
				from: eml.From,
				to: eml.To,
				subject: eml.Subject,
				text: eml.Text,
			};
			
			
			// pull user/password from eml_conf.js instead of HE
			switch (eml.service) {
				case "google":
					tp.auth.user = emlCnf[eml.From].authuser;
					tp.auth.pass = emlCnf[eml.From].authpwd;
					break;
					
				case "smtps (587)":
					tp.host = eml.server;
					tp.auth.user = emlCnf[eml.From].authuser;
					tp.auth.pass = emlCnf[eml.From].authpwd;
					break;
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
			
			/*
			transport.sendMail(tp, (err, info) => {
				//console.log(info);
				//console.log(info.envelope);
				//console.log(info.messageId);
			});		
			*/

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
		} else {
			console.log('Email not sent. Cannot find "' + eml.From + '" in eml_config.js.');
			res.end('Email not sent. Cannot find "' + eml.From + '" in defined email list.');
		}
    });


};
