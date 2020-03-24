const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

while(true){
	rl.question('>> ', answer => {
		console.log(`Thank you for your valuable feedback: ${answer}`);
		rl.close();
	});
}
