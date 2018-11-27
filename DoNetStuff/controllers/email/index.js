var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    sendmail: true,
    newline: 'unix',
    path: '/usr/sbin/sendmail'
});

module.exports = function(router){
	
	router.post('/', function (req, res) {
		var eml = req.body
		
		console.log(req.body);
	
		transporter.sendMail({
			from: eml.From,
			to: eml.To,
			subject: eml.Subject,
			text: eml.Text
		}, (err, info) => {
			//console.log(info.envelope);
			//console.log(info.messageId);
		});		
		
        res.end('Email Sent!');
    });


};
