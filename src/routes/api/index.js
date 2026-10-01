const express = require('express');
const booksRouter = require('../books');
const libraryRouter = require('../library');

const router = express.Router();

router.use('/books', booksRouter);
router.use('/library', libraryRouter);

module.exports = router;