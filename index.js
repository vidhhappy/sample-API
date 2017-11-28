const express = require('express')
const app = express()

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const KeyStore = require('./db/keystore');


const DB_URI = "ds121716.mlab.com:21716/keystore"
const DB_USERNAME = "user"
const DB_PASSWORD = "user"


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) =>{
   res.json("Welcome to VaultDragon KeyValue Store! ")}
 );


app.get('/object', (req, res) =>{
     KeyStore.find({}, function(err, docs) {
    if (!err){ 
        res.json(docs);
    } else {throw err;}
});}
 );


app.post('/object', (req, res) => {

    var key = req.body.key;
    var value = req.body.value;

    var valObj = {};

    //add value and created time
    valObj['value'] = value;
    var timestamp = Date.now();
    valObj['timestamp'] = timestamp;


    KeyStore.findOne({ 'key': key }, function (err, result) {
        if (err) {
           // return console.log("error: " + err);
			throw err;
        }
        


        if (result === null) {
            //create a new object     
            result = KeyStore({
                key: key,
                values: [valObj]
            })

        } else {
            //add it to existing obje
            var vals = result.values;
            vals.push(valObj)
        }
       // console.log(" vals ", result)
        
        result.save(function (err) {
            if (err) throw err;
            responseObj = {};
            responseObj['key'] = key;
            responseObj['value'] = value;
            responseObj['timestamp'] = timestamp;
            res.json(responseObj)
        });
    }
    
    
    
    );
})

//get

app.get('/object/:key', (req, res) => {
    var key=req.params.key;

    //check if timestamp is there or not
    var timestamp=req.query.timestamp

    //console.log("timestamp",timestamp)

    //find one key value pair, and sort values array and return the latest
    KeyStore.findOne({ key: key }, function (err, result) {
        if(err) {
          throw err; 
        }
               
        var vals=result.values;
        //check if vals are not null
        if(vals!=null){
            //if not null sort the values
            vals.sort(compare);
            //after sort get the latest obj
            var len=vals.length;

            var latest=null;

            if(timestamp!=null){
                latest=getBefore(vals,timestamp);
            }else{
              latest= vals[len-1];    
            }
                  
            var response={};
            response['key']=key;
            response['value']=latest.value;
            response['timestamp']=latest.timestamp;
            res.json(response);
        }
    });
})




function getBefore(arr,timestamp){

  if(!arr)
      return null;

  var len=arr.length;

  for(var i=0; i< len; i++){
      console.log(arr[i].timestamp.getTime())
      if(arr[i].timestamp>timestamp){
          
          //return the previous one sent in the query
          if(i===0){
              return "no data exists before the requested timestamp"
          }
         return arr[i-1];
      }
  }          
  return arr[len-1];
}


function compare(a,b) {
    if (a.timestamp < b.timestamp)
      return -1;
    if (a.timestamp > b.timestamp)
      return 1;
    return 0;
  }

var options = {
    db: { native_parser: true },
    server: { poolSize: 5 },
    replset: { rs_name: 'myReplicaSetName' },
    user: DB_USERNAME,
    pass: DB_PASSWORD
};
mongoose.connect(DB_URI, options);

app.listen(3000, () => console.log('Example app listening on port 3000!'))