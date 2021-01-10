const express = require('express');

var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/";

var test_id;
var test_name;

const app = express();

let users = [
    {
        id:1,
        name:'alice'
    },
    {
        id:2,
        name:'bek'
    },
    {
        id:3,
        name:'chris'
    }
]


//get

app.get('users', (req,res)=>{
    console.log('who get in here/users');
    res.json(users);

    console.log(users)
});

//post
app.post('/post', (req, res)=>{
    console.log('who get in here post /users');
    var inputData;

    req.on('data', (data)=>{
        inputData = JSON.parse(data);
    });

    req.on('end', ()=>{
        test_id = inputData.user_id;    //안드로이드에서 키값
        test_name = inputData.name;
        console.log("user_id"+inputData.user_id+", name:"+inputData.name);

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;

            var dbo = db.db("testdb");
            var myobj = { user_id: test_id, name: test_name };
            dbo.collection("frontend").insertOne(myobj, function(err, res) {
              if (err) throw err;
              console.log("1 document inserted");
              db.close();
            });
          });
    });
    
    res.write("OK!");
    res.end();
});

app.listen(3000, () => {
    console.log('Example app listeneing on post 3000');
});