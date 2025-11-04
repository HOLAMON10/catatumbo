db.timeoffrequesttypes.insertOne({
    _id: 'pending',
    name: 'Pending',
    isActive: true,
});

db.timeoffrequesttypes.insertOne({
    _id: 'approved',
    name: 'Approved',
    isActive: true,
});

db.timeoffrequesttypes.insertOne({
    _id: 'rejected',
    name: 'Rejected',
    isActive: true,
});

db.timeoffrequesttypes.insertOne({
    _id: 'cancelled',
    name: 'Cancelled',
    isActive: true,
});
