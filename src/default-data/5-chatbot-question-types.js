db.chatbotquestiontypes.insertOne({
  _id: 'openingMsg',
  name: 'Opening Message',
  isSearchable: false,
  isActive: true,
});
db.chatbotquestiontypes.insertOne({
  _id: 'multipleSelection',
  name: 'Multiple Selection',
  isSearchable: true,
  isActive: true,
});
db.chatbotquestiontypes.insertOne({
  _id: 'singleSelection',
  name: 'Single Selection',
  isSearchable: true,
  isActive: true,
});
db.chatbotquestiontypes.insertOne({
  _id: 'openAnswer',
  name: 'Open Answer',
  isSearchable: true,
  isActive: true,
});
db.chatbotquestiontypes.insertOne({
  _id: 'closingMsg',
  name: 'Closing Message',
  isSearchable: false,
  isActive: true,
});
