const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const customRoutes = require('./controllers');
const utilityHelpers = require('./utils/helpers');

const databaseConnection = require('./config/connection');
const SessionStore = require('connect-session-sequelize')(session.Store);

const webApp = express();
const PORT = process.env.PORT || 3001;

const handlebarsInstance = exphbs.create({ helpers: utilityHelpers });

const sessionConfig = {
  secret: 'Ultra confidential secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SessionStore({
    db: databaseConnection
  })
};

webApp.use(session(sessionConfig));

webApp.engine('handlebars', handlebarsInstance.engine);
webApp.set('view engine', 'handlebars');

webApp.use(express.json());
webApp.use(express.urlencoded({ extended: true }));
webApp.use(express.static(path.join(__dirname, 'public')));

webApp.use(customRoutes);

databaseConnection.sync({ force: false }).then(() => {
  webApp.listen(PORT, () => console.log('Server is now listening'));
});
