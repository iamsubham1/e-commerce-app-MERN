const express = require('express');

const router = express.Router();

const { addReview, deleteReview, updateReview } = require('../controllers/reviewController');

const verifyUser = require('../middleware/verifyUser')

router.post('/addreview', verifyUser, addReview);

router.delete('/deletereview/:id', verifyUser, deleteReview);

router.put('/editreview/:id', verifyUser, updateReview);

module.exports = router;