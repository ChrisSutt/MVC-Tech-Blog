const router = require('express').Router();
const { User } = require('../../models');
const secureAccess = require('../../utils/auth');

router.get('/', (req, res) => {
    User.findAll({})
    .then(remarkData => res.json(remarkData))
    .catch(error => {
      console.log(error);
      res.status(500).json(error);
    });
});

router.get('/:id', (req, res) => {
    User.findAll({
    where: {
      id: req.params.id
    }
  })
    .then(remarkData => res.json(remarkData))
    .catch(error => {
      console.log(error);
      res.status(500).json(error);
    });
});

router.post('/', async (req, res) => {
  try {
    const newRemark = await User.create({
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
    const remarkData = await User.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });
    if (!remarkData) {
      res.status(404).json({ message: '404 Remark ID not found' });
      return;
    }
    res.status(200).json(remarkData);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
