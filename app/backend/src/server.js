require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const authRoutes = require('./api/auth');
const fileUploadRoutes = require('./api/fileUpload');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const sequelize = require('./config/db');
const User = require('./models/User');
const File = require('./models/File');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());

app.use('/auth', authRoutes);
app.use('/file', fileUploadRoutes);

app.get('/', (req, res) => {
  res.send('Hello, SecureNest Cloud!');
});

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});

module.exports = app;
