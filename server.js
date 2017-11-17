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
app.use(express.static(__dirname + '/public'));



//index page == home page
app.get('/', (req, res) => {
    res.render('pages/home')
})

//sell page - display so we can add planets to sell
app.get('/sell', (req, res) => {
  db.collection('planets').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('pages/sell', {planets: result})
  })
})

//rent page - display so we can add planets to rent
app.get('/rent', (req, res) => {
  db.collection('planetsforrent').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('pages/rent', {planetsforrent: result})
  })
})

//Creating a new planet to sell
app.post('/sell', (req, res) => {
  db.collection('planets').save(req.body, (err, result) => {
    if (err) return console.log(err)
      console.log('saved planet to sell on db')
      res.redirect('/planetsforsale')
  })
})

//Creating a new planet for rent 
app.post('/rent', (req, res) => {
  db.collection('planetsforrent').save(req.body, (err, result) => {
    if (err)
        return console.log(err)
      console.log('saved rented planet in the db')
        res.redirect('/planetsforrent')
  })
})

//listing a planet - provides the route for listing a planet 
app.get('/listingaproperty', (req, res) => {
    res.render('pages/listingaproperty')
})

//displaying planets for sale on the planetsforsale page
app.get('/planetsforsale', (req, res) => {
    db.collection('planets').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('pages/planetsforsale', {planets: result})
  })
})

//displaying planets for rent on the platnetsforrent page.
app.get('/planetsforrent', (req, res) => {
    db.collection('planetsforrent').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('pages/planetsforrent', {planetsforrent: result})
  })
})




