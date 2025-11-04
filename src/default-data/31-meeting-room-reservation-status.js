db.meetingroomreservationstatuses.insertOne({
  _id: 'reserved',
  name: 'Reserved',
  isActive: true
});
db.meetingroomreservationstatuses.insertOne({
  _id: 'rescheduled',
  name: 'Rescheduled',
  isActive: true
});
db.meetingroomreservationstatuses.insertOne({
  _id: 'canceled',
  name: 'Canceled',
  isActive: true
});