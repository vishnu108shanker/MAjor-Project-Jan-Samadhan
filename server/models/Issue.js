const mongoose = require('mongoose');
const { Schema, model } = mongoose;


// the schema has been reviewed as on 20/4 , it is visible that in future a lot many changes are needed 

const IssueSchema = new Schema({

  token: {
    type: String,
    required: true,
    unique: true
  },

  citizenId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  description: {
    type: String,
    required: true
  },

  department: {
    type: String,
    enum: ['Roads', 'Water', 'Sanitation', 'Electricity', 'Health', 'Education'],
    required: true
  },

  location: {
    type: String,
    required: true
  },

  photoUrl: String,

  status: {
    type: String,
    enum: ['Submitted', 'Assigned', 'In Progress', 'Resolved'],
    default: 'Submitted'
  },

  officerNotes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },

  resolvedAt: Date

});

module.exports = model('Issue', IssueSchema);