const express = require('express');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const api = require('./routes');
const bodyParser = require('body-parser');
const models = require('./models');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use(morgan('dev'));

nunjucks.configure('views', {noCache: true});
app.set('view engine', 'html');
app.engine('html', nunjucks.render);

app.use('/', api);

models.db.sync({force: true})
.then(function () {
    app.listen(1234, function () {
        console.log('Server is listening on port 1234!');
    });
})
.catch(console.error);
