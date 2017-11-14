const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()

var db

MongoClient.connect('mongodb://rosalie:rosalie1@ds257495.mlab.com:57495/real-planets', (err, database) => {
	//start the server boys
	if (err) return console.log(err)
	db = database
	app.listen(process.env.PORT || 3000, () => {
    	console.log('listening on 3000')
  	})
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
	//find method returns a mongoDB object called a cursor.
	var cursor = db.collection('quotes').find().toArray((err, result) => { 
		if (err) return console.log(err)
		//renders index page
		res.render('index.ejs', {quotes:result})
	})
})

app.post('/quotes', (req, res) => {
	console.log(req.body)
	db.collection('quotes').save(req.body, (err, result) => { 
		if (err) return console.log(err)
			console.log('saved to db')
		res.redirect('/')
	})
})





