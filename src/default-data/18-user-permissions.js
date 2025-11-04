db.userpermissions.insertOne({
  _id: 'createOrModifyEmployeeSalary',
  name: 'User can create or modify employee salary',
  isActive: true,
});
db.userpermissions.insertOne({
  _id: 'canAccessEmployeeSalary',
  name: 'User can acess to employee salary',
  isActive: true,
});
db.userpermissions.insertOne({
  _id: 'userCanAccessAllEmployeeTeamsInAgentsPlatform',
  name: 'User can access all employee teams in agent platform',
  isActive: true,
});
db.userpermissions.insertOne({
  _id: 'userCanAccessHermesBotConfigurations',
  name: 'User can access the HermesBot configurations',
  isActive: false,
});
db.userpermissions.insertOne({
  _id: 'userCanModifyHermesBotConfigurations',
  name: 'User can modify the HermesBot configurations',
  isActive: false,
});
db.userpermissions.insertOne({
  _id: 'userCanAccessHermesBotCommunicationsDetails',
  name: 'User can access the HermesBot Communications Details',
  isActive: false,
});
db.userpermissions.insertOne({
  _id: 'userCanChangePlatformMainImage',
  name: 'User can change the Main Platform Image',
  isActive: true,
});
db.userpermissions.insertOne({
  _id: 'userCanChangePlatformFooterImage',
  name: 'User can change the Footer Platform Image',
  isActive: true,
});
db.userpermissions.insertOne({
  _id: 'userCanAccessToEmployeeInformationDashboard',
  name: 'User can access to employee information dashboard',
  isActive: true,
});
db.userpermissions.insertOne({
  _id: 'userCanModifyEmployeeAttendanceFromAdminPlatform',
  name: 'User can modify Employee\'s Attendance from Admin Platform',
  isActive: true,
});
