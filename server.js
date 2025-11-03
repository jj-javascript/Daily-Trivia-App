
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = "mongodb+srv://justinrafjimenez_db_user:Jb4GBVgcPDyxjHRu@cluster0.rccggbd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "Networking_Chat_App";

app.listen(3005, () => {
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
      throw error;
    }
    db = client.db(dbName);
    console.log("Connected to `" + dbName + "`!");
  });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('chatMessages').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', { chatMessages: result })
  })
})

app.post('/chatMessages', (req, res) => {
  db.collection('chatMessages').insertOne({ name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown: 0 }, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/chatMessages', (req, res) => {
  let thumbLogic
  if (Object.keys(req.body)[2] == 'thumbUp') {
    thumbLogic = req.body.thumbUp + 1
    // Create conditional to toggle between put for thumbUp and thumbDown
  } else if (Object.keys(req.body)[2] == 'thumbDown'){
    thumbLogic = req.body.thumbDown - 1
  }
  console.log(thumbLogic)
  db.collection('chatMessages')
    .findOneAndUpdate({ name: req.body.name, msg: req.body.msg }, {
      $set: {
        thumbUp: thumbLogic
      }
    }, {
      sort: { _id: -1 },
      upsert: true
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
})

app.delete('/chatMessages', (req, res) => {
  db.collection('chatMessages').findOneAndDelete({ name: req.body.name, msg: req.body.msg }, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
