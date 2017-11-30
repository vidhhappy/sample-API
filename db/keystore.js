var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create a schema and model 
var ValueSchema = new Schema(
	{ 
	value: String,
	timestamp:Date
	});


var keyValueSchema = new Schema({
  key: String,
  values:[ValueSchema]
});

var KeyValue = mongoose.model('KeyValue', keyValueSchema);

/**var keyvalue = new KeyValue({ 
    key: '101',
    Values: [
        {value: 'Vidhya', timestamp: Date.now},
        
    ] 
});

keyvalue.save(function (err) {
    if (err) return handleError(err)
    console.log('Success!');
}); **/

module.exports = KeyValue;