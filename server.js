const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./routes');
const helpers = require('./utils')
const sequelize = require('./config/connection')

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    
    sequelize.sync({ force: false })
      .then(() => {
        console.log('Database synced successfully.');
      })
      .catch((err) => {
        console.error('Error syncing the database:', err);
      });
  });