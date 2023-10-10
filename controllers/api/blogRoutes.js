const router = require('express').Router();
const { Blog } = require('../../models');
const secureAccess = require('../../utils/auth');

router.post('/', secureAccess, async (req, res) => {
  try {
    const freshBlog = await Blog.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(freshBlog);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.delete('/:id', secureAccess, async (req, res) => {
  try {
    const blogData = await Blog.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!blogData) {
      res.status(404).json({ message: '404 Article ID not found' });
      return;
    }

    res.status(200).json(blogData);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
