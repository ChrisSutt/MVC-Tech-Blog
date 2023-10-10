const customRouter = require('express').Router();
const { UserRemark } = require('../../models');
const secureAccess = require('../../utils/security');

customRouter.get('/', (req, res) => {
  UserRemark.findAll({})
    .then(remarkData => res.json(remarkData))
    .catch(error => {
      console.log(error);
      res.status(500).json(error);
    });
});

customRouter.get('/:id', (req, res) => {
  UserRemark.findAll({
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

customRouter.post('/', async (req, res) => {
  try {
    const newRemark = await UserRemark.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    res.json(newRemark);
  } catch (error) {
    res.status(500).json(error);
  }
});

customRouter.delete('/:id', secureAccess, async (req, res) => {
  try {
    const remarkData = await UserRemark.destroy({
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

module.exports = customRouter;
