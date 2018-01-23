const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/wikistack',
{logging: false}
);

const Page = db.define('page', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    notEmpty: true
  },
  urlTitle: {
    type: Sequelize.STRING,
    allowNull: false
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
    notEmpty: true
  },
  status: {
    type: Sequelize.ENUM('open', 'closed')
  },
  date: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
}, {
  hooks: {
    beforeValidate: function(page) {
      if (!page.title){
        page.urlTitle = Math.random().toString(36).substring(2, 12);
      }
      else {
        page.urlTitle = page.title.replace(/\s+/g, '_').replace(/\W/g, '').toLowerCase();
      }
    }
  },
  getterMethods: {
    route: function() {
      return '/wiki/' + this.urlTitle;
    }
  }
});

// Page.hook('beforeValidate', function(page) {
//   if (!page.title){
//     page.urlTitle = Math.random().toString(36).substring(2, 12);
//   }
//   else {
//     page.urlTitle = page.title.replace(/\s+/g, '_').replace(/\W/g, '').toLowerCase();
//   }
// });

const User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    notEmpty: true
  },
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true
    },
    allowNull: false
  }
});

Page.belongsTo(User, { as: 'author' });

module.exports = {
  db: db,
  User: User,
  Page: Page
};
