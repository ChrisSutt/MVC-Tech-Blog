const router = require('express').Router();
const { UserProfile } = require('../../utils/auth');

router.post('/', async (req, res) => {
  try {
    const userProfileData = await UserProfile.create(req.body);

    req.session.save(() => {
      req.session.user_id = userProfileData.id;
      req.session.logged_in = true;

      res.status(200).json(userProfileData);
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post('/login', async (req, res) => {
  try {
    const userProfileData = await UserProfile.findOne({ 
			where: { username: req.body.username } 
		});

    if (!userProfileData) {
      res
        .status(400)
        .json({ message: 'Incorrect username or password, please try again' });
      return;
    }

    const validPassword = await userProfileData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect username or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userProfileData.id;
      req.session.logged_in = true;
      
      res.json({ user: userProfileData, message: 'You are now logged in!' });
    });

  } catch (error) {
    res.status(400).json(error);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
