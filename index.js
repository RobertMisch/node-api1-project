const express = require('express');
const shortid = require('shortid');
//CommonJS Modules (Module is just a file you wanna use)

const server = express();
server.use(express.json())//teches express how to ready json from the body
let users = [{
	id: shortid.generate(), // hint: use the shortid npm package to generate it
	name: "Jane Doe", // String, required
	bio: "Not Tarzan's Wife, another Jane",  // String, required
},]

server.get('/', (req, res) => {
	res.json({ api: 'up and running. are we refreshing' });
});

server.post('/api/users', (req, res) => {
	const usersInfo = {
		id: shortid.generate(),
		name: req.body.name,
		bio: req.body.bio
	};

	if (res._hasBody && users) {
		if (usersInfo.name && usersInfo.bio) {
			users.push(usersInfo);
			res.status(201).json(usersInfo);
		} else {
			res.status(400).json({ "errorMessage": "The users information is incomplete" })
		}
	} else {
		res.status(500).json({ "errorMessage": "The users information could not be retrieved." })
	}
})

server.get('/api/users', (req, res) => {
	// console.log(res._hasBody)
	if (res._hasBody && users) {
		res.status(200).json(users);
	} else {
		res.status(500).json({ "errorMessage": "The users information could not be retrieved." })
	}
});
server.get('/api/users/:id', (req, res) => {
	const id = req.params.id;
	let user;
	users.forEach((item) => { if (id === item.id) { user = item } });

	if (res._hasBody && users) {
		if (user) {
			res.status(200).json(user);
		} else {
			res.status(404).json({ "message": "The user with the specified ID does not exist." })
		}
	} else {
		res.status(500).json({ "errorMessage": "The users information could not be retrieved." })
	}
});
server.delete("/api/users/:id", (req, res) => {
	const id = req.params.id;
	let user;
	users.forEach((item) => { if (id === item.id) { user = item } });
	if (res._hasBody && users) {
		users = users.filter(user => user.id !== id)
		users.forEach((item) => {
			if (id === item.id) {
				res.status(500).json({ "errorMessage": "The users information could not be removed." })
			}
		});
		res.status(200).json(users)
	} else {
		res.status(404).json({ "message": "The user with the specified ID does not exist." })
	}
})

server.put("/api/users/:id", (req, res) => {
	const id = req.params.id;
	let userFound = false;
	const usersInfo = {
		id: req.body.id,
		name: req.body.name,
		bio: req.body.bio
	};
	if (res._hasBody && users) {
		if (usersInfo.name && usersInfo.bio) {
			users.forEach((item, index) => {
				if (id === item.id) {
					users[index] = usersInfo
					userFound = true
				}
			});
			if (!userFound) {
				res.status(404).json({ "message": "The user with the specified ID does not exist." })
			}else{
				res.status(200).json(users)
			}
		}else{
			res.status(400).json({ "errorMessage": "The users information is incomplete" })
		}
	} else {
		res.status(500).json({ "errorMessage": "The users information could not be reached." })
	}
})

server.listen(8000, () => console.log('\nAPI is up ==\n'))