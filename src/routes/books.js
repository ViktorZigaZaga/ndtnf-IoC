const express = require('express');
const axios = require('axios');
const Library = require('../models/BookSchema');
const unloadMulter = require('../middleware/unload');
const router = express.Router();
const container = require('../container');
const BooksRepository = require('../BooksRepository');

const COUNTER_URL = process.env.COUNTER_URL || 'https://counter:3003';
// const baseAxiosURL = axios.create({
//   baseURL: COUNTER_URL,
// });


router.get('/', async (req, res, next) => {
    let books;
    let repo;
    try {
        repo = container.get(BooksRepository);
        books = await repo.getBooks();
        res.render('../src/views/books/index', {
            title: 'Books',
            books: books,
        });
    } catch(e) {
        res.status(500).json(e);
    }

    if (!books) {
        res.redirect('/404');
    }
});

router.get('/:id', async (req, res, next) => {

    const {id} = req.params;
    await axios.post(`${COUNTER_URL}/counter/${id}/incr`);
    const counterViews = await axios.get(`${COUNTER_URL}/counter/${id}`);
    console.log(counterViews.data.cnt)

    let book;
    let repo;
    try{
        repo = container.get(BooksRepository);
        book = await repo.getBook(req.params.id);
        res.render('../src/views/books/view', {
            title: 'Book view',
            book: book,
            counter: counterViews,
        });
    } catch(e) {
        res.status(500).json(e);
    }

    if (!book) {
        res.redirect('/404');
    }
});

router.get('/:id/download', async (req, res, next) => {
    const {id} = req.params;
    let book;
    let repo;
    try{
        repo = container.get(BooksRepository);
        book = await repo.getBook(id);
        res.download(`${__dirname}/../public/books/${book.fileBook}`, book.fileName, err => {
            if (err) {
                res.status(500).json(err);
            }
        });
    } catch(e) {
        res.status(500).json(e);
    }

    if (!book) {
        res.redirect('/404');
    }
});

router.get('/create', (req, res) => {
    res.render('../src/views/books/create', {
        title: 'Book create',
        books: {},
    });
});

router.post('/create', unloadMulter.single('filebook'), async (req, res, next) => {
    const {
        title, 
        authors, 
        description, 
        favorite, 
        fileCover, 
        fileName,
        fileBook,
    } = req.body;

    // if (!req.file) {
    //     res.redirect('/404');
    //     return;
    // }
    // const fileBook = req.file.path;

    let book;
    let repo;
    try {
        repo = container.get(BooksRepository);
        book = repo.createBook({
            title, 
            authors, 
            description, 
            favorite, 
            fileCover, 
            fileName,
            fileBook,
        });
        res.redirect('/api/books');
    } catch (e) {
        res.status(500).json(e);
    }
});

router.get('/update/:id', async (req, res, next) => {
    const {id} = req.params;
    let book;
    let repo;
    try{
        repo = container.get(BooksRepository);
        book = await repo.getBook(id);
        res.render('../src/views/books/update', {
            title: 'Book update',
            books: book,
        });
    } catch(e) {
        res.status(500).json(e);
    }

    if (!book) {
        res.redirect('/404');
    }
});

router.post('/update/:id', unloadMulter.single('filebook'), async (req, res) => {
    const {id} = req.params;
    const {
        title, 
        authors, 
        description, 
        favorite, 
        fileCover, 
        fileName,
        fileBook,
    } = req.body;

    // if (!req.file) {
    //     res.redirect('/404');
    //     return;
    // }
    // const fileBook = req.file.path;

    let book;
    let repo;
    try {
        repo = container.get(BooksRepository);
        book = await repo.updateBook(id, {
            title, 
            authors, 
            description, 
            favorite, 
            fileCover, 
            fileName,
            fileBook,
        });
        res.redirect(`/api/books/${id}`);
    } catch (e) { 
        res.status(500).json(e);
    }

    if(!book) {
        res.redirect('/404');
    }
});

router.post('/delete/:id', async (req, res) => {
    const {id} = req.params;
    let repo;
    try{
        repo = container.get(BooksRepository);
        await repo.deleteBook(id);
    } catch(e) {
        res.status(500).json(e);
    }
});

module.exports = router;
