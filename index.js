// application packages
const express = require('express')
const app = express()
const port = 3000

const path = require('path')
// add template engine
const hbs = require('express-handlebars');
// setup template engine 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts/',
}))
// setup static public directory
app.use(express.static('public'));

const mysql = require('mysql')

const bodyParser = require('body-parser');
const res = require('express/lib/response');
const { measureMemory } = require('vm');
app.use(bodyParser.urlencoded({extended: true}))

// create database connection
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "qwerty",
    database: "joga_mysql"
});

con.connect(function(err) {
    if (err) throw err;
    console.log('Connected to joga_mysql db');
})

// show all articles - index page
app.get('/', (req, res) => {
    let query = 'SELECT * FROM article';
    let articles = []
    con.query(query, (err, result) => {
        if (err) throw err;
        articles = result
        res.render('index', {
            articles: articles
        })
    })
})

// show article by this slug
app.get('/article/:slug', (req, res) => {
    let query = `SELECT article.name AS name, article.published AS published, article.image AS image, article.author_id AS author_id, author.name AS author FROM article INNER JOIN author ON article.author_id=author.id WHERE slug="${req.params.slug}"`;
    let article
    con.query(query, (err, result) => {
        if (err) throw err;
        article = result
        console.log(article);
        res.render('article', {
            article: article
        })
    })
})

// author page
app.get('/author/:id', (req, res) => {
    let query = `SELECT article.name AS name, article.image AS image, article.author_id AS author_id, author.name AS author FROM article INNER JOIN author ON article.author_id=author.id WHERE author.id="${req.params.id}"`;
    let articles = []
    let name
    con.query(query, (err, result) => {
        if (err) throw err;
        console.log(result[0].author);
        articles = result
        name = result[0]
        res.render('author', {
            articles: articles,
            name: name
        })
    })
})



// app start point
app.listen(port, () => {
    console.log(`Now listening on port http://localhost:${port}`)
})