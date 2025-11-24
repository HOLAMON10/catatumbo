db.userpermissions.insertOne({
  _id: 'userCanCreateNewUser',
  name: 'User can create new users',
  isActive: true,
});

db.userpermissions.insertOne({
  _id: 'userCanModifyExistingUser',
  name: 'User can modify existing user profiles',
  isActive: true,
});

db.userpermissions.insertOne({
  _id: 'userCanDeactivateUser',
  name: 'User can deactivate or suspend a user account',
  isActive: true,
});

db.userpermissions.insertOne({
  _id: 'userCanAssignRoles',
  name: 'User can assign roles to other users',
  isActive: true,
});

db.userpermissions.insertOne({
  _id: 'userCanModifyRoles',
  name: 'User can modify roles and permission groups',
  isActive: true,
});

db.userpermissions.insertOne({
  _id: 'userCanAccessUserProfiles',
  name: 'User can view and access all user profiles',
  isActive: true,
});

db.userpermissions.insertOne({
  _id: 'userCanManageAccessLevels',
  name: 'User can manage access level settings',
  isActive: true,
});
