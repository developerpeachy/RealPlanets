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

//index page
app.get('/', (req, res) => {
  db.collection('planets').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('pages/index', {planets: result})
  })
})

app.post('/planets', (req, res) => {
  db.collection('planets').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('saved planet to database')
    res.redirect('/')
  })
})

//home page
app.get('/home', (req, res) => {
    res.render('pages/home')
})

//planets for sale page
app.get('/planets', (req, res) => {
    db.collection('planets').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('pages/planets', {planets: result})
  })
})




