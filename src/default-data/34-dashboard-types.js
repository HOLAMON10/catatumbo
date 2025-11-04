db.dashboardtypes.insertMany([
	{
		_id: 'manager-dashboard',
		name: 'Manager',
		isActive: true,
	},
	{
		_id: 'uppermanagement-dashboard',
		name: 'Super Admin',
		isActive: true,
	},
	{
		_id: 'agent-dashboard',
		name: 'Agent',
		isActive: true,
	},
]);
