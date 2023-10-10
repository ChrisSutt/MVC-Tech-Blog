const router = require('express').Router();
const { UserProfile, Article, Comment } = require('../models');
const ensureAuth = require('../utils/auth');

router.get('/', async (req, res) => {
	try {
		const articleData = await Article.findAll({
			include: [{
				model: UserProfile,
				attributes: ['username'],
			}],
		});

		const articles = articleData.map((article) => article.get({
			plain: true
		}));

		res.render('homepage', {
			articles,
			logged_in: req.session.logged_in
		});
	} catch (error) {
		res.status(500).json(error);
	}
});

router.get('/article/:id', async (req, res) => {
	try {
		const articleData = await Article.findByPk(req.params.id, {
			include: [
				{
					model: UserProfile,
					attributes: ['username'],
				}, {
					model: Comment,
					include: [
						UserProfile
					]
				}
			],
		});

		const article = articleData.get({
			plain: true
		});

		res.render('article', {
			...article,
			logged_in: req.session.logged_in
		});
	} catch (error) {
		res.status(500).json(error);
	}
});

router.get('/dashboard', ensureAuth, async (req, res) => {
	try {
		const userData = await UserProfile.findByPk(req.session.user_id, {
			attributes: {
				exclude: ['password']
			},
			include: [{
				model: Article
			}],
		});

		const user = userData.get({
			plain: true
		});

		res.render('dashboard', {
			...user,
			logged_in: true
		});
	} catch (error) {
		res.status(500).json(error);
	}
});

router.get('/login', (req, res) => {
	if (req.session.logged_in) {
		res.redirect('/dashboard');
		return;
	}

	res.render('login');
});

router.get('/signUp', (req, res) => {
	if (req.session.logged_in) {
		res.redirect('/dashboard');
		return;
	}
	res.render('signUp');
});

module.exports = router;
