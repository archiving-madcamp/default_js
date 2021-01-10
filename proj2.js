const express = require('express');
var mongoose = require('mongoose');



var url = "mongodb://localhost:27017/testdb";

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
        
        //한번은 올라가 지는데 두번은 안되는 문제
        mongoose.connect(url, {
            useNewUrlParser: true,
            useCreateIndex: true,
        })
        .then(()=>{
            console.log('connected')
        })
        .catch((err)=>{
            console.log(err)
        })

        const UserSchema = new mongoose.Schema({
            user_id : String,
            name: String
        })

        //한번만 만들어야되는데 컬렉션을 여러번 만들어서 오류나는듯함
        var User = mongoose.model("hi", UserSchema)

        var me = new User({
            user_id: test_id,
            name: test_name
        })

        me.save()
        .then(() => {
            console.log(me);
        })
        .catch((err) =>{
            console.log(err);
        })


      

    })

/*
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
*/
    res.write("OK!");
    res.end();
});


app.listen(3000, () => {
    console.log('Example app listeneing on post 3000');
})
