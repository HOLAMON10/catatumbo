db.interviewtypes.insertOne({
  _id: 'phoneCall',
  name: 'Phone Call',
  description: 'First call',
  indexOrder: 1,
  isActive: true,
});
db.interviewtypes.insertOne({
  _id: 'videocall',
  name: 'Video Call',
  description: 'Video call to meet the candidate',
  indexOrder: 2,
  isActive: true,
});
db.interviewtypes.insertOne({
  _id: 'interviewInPlace',
  name: 'Interview in Place',
  description: 'Interview to califacate the candidate\'s interaction',
  indexOrder: 3,
  isActive: true,
});
