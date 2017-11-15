const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()
const nib = require('nib')
const stylus = require('stylus')
const ejsLayouts = require('express-ejs-layouts')

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
function compile(str, path) {
	return stylus(str)
	.set('filename', path)
	.use(nib())
}
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('/public'))

app.use(stylus.middleware({
    src: __dirname + '/public',
    compile: compile
}))

//index page - Planets for sale (planets)
app.get('/', (req, res) => {
  db.collection('planets').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('pages/index', {planets: result})
  })
})

//get request for rental planets
app.get('/rent', (req, res) => {
  db.collection('planetsforrent').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('pages/rent', {planetsforrent: result})
  })
})

//posting all planets to the index page 
app.post('/planets', (req, res) => {
  db.collection('planets').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('saved planet to database')
    alert("Planet has been posted for Sale");
    res.redirect('/planets')
  })
})

//index page - adding Planets for Rent.
app.post('/planetsforrent', (req, res) => {
  db.collection('planetsforrent').save(req.body, (err, result) => {
    if (err) 
      {
        return console.log(err)
        res.redirect('/rent')
      }
      else {
        console.log('saved rented planet to database')
        res.redirect('/planetsforrent')
      }
  })
})


//home page
app.get('/home', (req, res) => {
    res.render('pages/home')
})

//posting planets for sale page
app.get('/planets', (req, res) => {
    db.collection('planets').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('pages/planets', {planets: result})
  })
})

//posting all rental planets on the platnetsforrent page.
app.get('/planetsforrent', (req, res) => {
    db.collection('planetsforrent').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('pages/planetsforrent', {planetsforrent: result})
  })
})




