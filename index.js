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


const bodyParser = require('body-parser');
const res = require('express/lib/response');
const { measureMemory } = require('vm');
app.use(bodyParser.urlencoded({extended: true}))

// import article route
const articleRoutes = require('./routes/article'); 

// to use article routes
app.use('/', articleRoutes);
app.use('/article', articleRoutes)

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