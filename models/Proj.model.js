var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var projSchema = new Schema({
  name: { type: String },
  hasCreditCookie: Boolean,
  username: String, 
  colors: [{
  	color_id: Number,
  	data: String,
  	title: String,
  	descr: String
  }],
  _creator: [{
        type:  Schema.Types.ObjectId,
        ref: 'User',
    }]
});

module.exports = mongoose.model('Proj', projSchema);