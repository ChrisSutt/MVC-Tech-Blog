const router = require('express').Router();
const { Comment } = require('../../models');
const secureAccess = require('../../utils/auth');

router.get('/', (req, res) => {
    Comment.findAll({})
    .then(commentData => res.json(commentData))
    .catch(error => {
      console.log(error);
      res.status(500).json(error);
    });
});

router.get('/:id', (req, res) => {
    Comment.findAll({
    where: {
      id: req.params.id
    }
  })
    .then(commentData => res.json(commentData))
    .catch(error => {
      console.log(error);
      res.status(500).json(error);
    });
});

router.post('/', async (req, res) => {
  try {
    const newRemark = await Comment.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    res.json(newRemark);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete('/:id', secureAccess, async (req, res) => {
  try {
    const commentData = await Comment.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });
    if (!remarkData) {
      res.status(404).json({ message: '404 Remark ID not found' });
      return;
    }
    res.status(200).json(commentData);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
