const sequelize = require('../config/connection')
const { Blog, Comment, User } = require('../models')
const seedBlog = require('./blogData.json')
const seedComment = require('./commentData.json')
const seedUser = require('./userData.json')

const seedAll = async () => {
    await sequelize.sync({ force: true });

    await User.bulkCreate(seedUser, {
        individualHooks:true,
        returning: true,
    });

    for (const blog of seedBlog) {
        await Blog.create({
          ...blog,
          user_id: users[Math.floor(Math.random() * users.length)].id,
        });
      }

    await Comment.bulkCreate(seedComment);

    process.exit(0);

};

seedAll();