db.users.insertOne( {
        "firstName": "test",
        "lastName": "test",
        "email": "testy@gmail.com",
        "accessProfile": ObjectId("691a8bcf4000a71c7cb96127"),
        "userType": "admin",
        "verificationToken": null,
        "isActive": true,
        "isConfirmed": false,
        "keepSessionAlive": false,
        "__v": 4,
        "password": "202cb962ac59075b964b07152d234b70",
        "allowedPermissions": [
            "userCanCreateNewUser",
            "userCanModifyExistingUser",
            "userCanDeactivateUser",
            "userCanAssignRoles",
            "userCanModifyRoles",
            "userCanAccessUserProfiles",
            "userCanManageAccessLevels"
        ],
        "dashboardUrl": "https://charts.mongodb.com/charts-project-0-ipdjkmz/a0b7a829-db37-4f77-8c4f-e90dcb1215e0"
    });

//password: god$favorites#1
