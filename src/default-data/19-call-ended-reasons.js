db.callendedreasons.insertOne({
  _id: 'assistant-forwarded-call',
  name: 'Assistant Forwarded Call',
  isActive: true,
});
db.callendedreasons.insertOne({
  _id: 'customer-busy',
  name: 'Customer Busy',
  isActive: true,
});
db.callendedreasons.insertOne({
  _id: 'customer-did-not-answer',
  name: 'Customer did not Answer',
  isActive: true,
});
db.callendedreasons.insertOne({
  _id: 'customer-ended-call',
  name: 'Customer Ended Call',
  isActive: true,
});
db.callendedreasons.insertOne({
  _id: 'silence-timed-out',
  name: 'Silence Timed Out',
  isActive: true,
});
db.callendedreasons.insertOne({
  _id: 'twilio-failed-to-connect-call',
  name: 'Twilio Failed to Connect Call',
  isActive: true,
});
db.callendedreasons.insertOne({
  _id: 'voicemail',
  name: 'Voicemail',
  isActive: true,
});
