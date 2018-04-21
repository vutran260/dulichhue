var express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

// Connect to Mongo Database
mongoose.connect(config.database);

// On Connected
mongoose.connection.on('connected', () => {
	console.log('Connect to database ' + config.database);
})

// On Connected Error
mongoose.connection.on('error', (err) => {
	console.log('Failed to connect database. Error: ' + err);
})

const app = express();

const users = require('./routes/users');
const blogs = require('./routes/blogs');
const tags = require('./routes/tags');
const sliders = require('./routes/sliders');
const contacts = require('./routes/contacts');
const uploads = require('./routes/uploads');

// Port Number
const port = process.env.PORT || 8080;

// CORS MiddleWare
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser MiddleWare
app.use(bodyParser.json());

// Passport MiddleWare
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);
app.use('/blogs', blogs);
app.use('/tags', tags);
app.use('/sliders', sliders);
app.use('/contacts', contacts);
app.use('/uploads', uploads);

// Index Route
app.get('/', (req, res) =>{
	res.send('Invalid Enpoint');
})

// Index Page
app.get('*', function(req, res) {
  res.sendfile(path.join(__dirname, 'public/index.html'));
})

//Start Server
app.listen(port, () => {
	console.log('Server started on port ' + port);
})