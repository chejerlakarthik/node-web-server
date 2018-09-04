const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
const maintenanceSwitch = false;

const app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', hbs);

app.use(express.static(__dirname + '/pages'));

app.use((req, res, next) => {
    let now = new Date().toString();
    let log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) console.log('Could not update server.log');
    });
    next();
});

app.use((req,res,next) => {
    if (maintenanceSwitch){
        res.render('maintenance.hbs', {
            pageTitle : 'Site under maintenance...'
        });
    }else{
        next();
    }
    
});

hbs.registerHelper('currentYear', () => new Date().getFullYear());
hbs.registerHelper('capitalize', (text) => text.toUpperCase());

app.get('/', (req,res) => {
    res.render('home.hbs', {
        company : {
            name : 'ABC Corporation',
            founded : 1975,
            ceo : 'Tim Cook',
            type : 'e-Commerce'
        },
        pageTitle : 'ABC Corporation',
        message : 'Welcome'
    })
});

app.get('/about', (req,res) => {
    res.render('about.hbs', {
        pageTitle : 'About Page'
    });
});

app.get('/bad', (req,res) => {
    res.send({
        error : "This is a bad request"
    });
});

app.get('/projects', (req,res) => {
    res.render('projects.hbs', {
        pageTitle : 'Project Portfolios'
    });
});

app.listen(port, () => {
    console.log(`Server up & running on port ${port}`);
});
