var nexCnf = require('../../nex_config');
const { exec } = require("child_process");

module.exports = function(router){

	//router.get('/', function (req, res) {
	//	res.send({ config:nexCnf } );
	//});
	
	router.post('/', function (req, res) {
		var nex = req.body;

		dbgNex = JSON.stringify(nex);
		dbgNexCnf = JSON.stringify(nexCnf);
		console.log(`nex: ${dbgNex}`);
		console.log(`nexCnf: ${dbgNexCnf}`);
		
		var addParms = (nex[1].addParms ? nex[1].addParms.replace(";","") + " " : "");
		var nexData = nex[0].data.replace(";","");
		var cmd = nexCnf.command + " " + addParms + nexData;

		console.log(`command: ${cmd}`);
		
		exec(cmd, (error, stdout, stderr) => {
			if (error) {
				console.log(`error: ${error.message}`);
				return;
			}
			if (stderr) {
				console.log(`stderr: ${stderr}`);
				return;
			}
			console.log(`stdout: ${stdout}`);
		});		

		
		res.end("done.");

    });


};
