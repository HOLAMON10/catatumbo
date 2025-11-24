db.users.insertOne({
	_id: ObjectId('5ef56fb994740d02672fcdb0'),
	firstName: 'admin',
	lastName: 'user',
	email: 'test@test.com',
	userType: 'admin',
	accessProfile: ObjectId('5f0e16218190c20e7885d7a6'),
	password: '335ba4c0221e9a4a1b2deab494273080',
	isAdmin: true,
	isActive: true,
	creationDate: new Date(),
});

//password: god$favorites#1
