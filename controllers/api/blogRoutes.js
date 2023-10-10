const router = require('express').Router();
const { Article } = require('../../models');
const secureAccess = require('../../utils/auth');

router.post('/', secureAccess, async (req, res) => {
  try {
    const freshArticle = await Article.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(freshArticle);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.delete('/:id', secureAccess, async (req, res) => {
  try {
    const articleData = await Article.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!articleData) {
      res.status(404).json({ message: '404 Article ID not found' });
      return;
    }

    res.status(200).json(articleData);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
