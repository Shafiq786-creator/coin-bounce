const express = require('express');
const authController = require('../controller/authController');
const blogController = require('..//controller/blogController');
const commentController = require('../controller/commentController');
const auth = require('../middlewears/auth');

const router = express.Router();


router.get('/', (req, res) => res.json({msg:'Welcome to the homepage!'}));
//testing
router.get('/test', (req, res) => res.json({msg: 'Working!'}));

//user
//register
router.post('/register', authController.register);
//login
router.post('/login', authController.login);
//logout
router.post('/logout', auth, authController.logout);
//refresh
router.get('/refresh', authController.refresh)

//blogs
//create
router.post('/blog', auth, blogController.create);
//get all pages
router.get('/blog/all', auth, blogController.getAll);
//get blog by Id
router.get('/blog/:id', auth, blogController.getById);
//update
router.put('/blog/:id', auth, blogController.update);
//delete
router.delete('/blog/:id', auth, blogController.delete);

//comment
//create comment
router.post('/comment', auth, commentController.create);

//read comments by blog Id
router.get('/comment/:id', auth, commentController.getById);

module.exports = router;