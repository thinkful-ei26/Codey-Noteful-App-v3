'use strict';

const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config');

const Note = require('../models/note');

const express = require('express');

const router = express.Router();

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
    .then(() => {
      return Note.find().sort({ updatedAt: 'desc' });
    })
    .then(results => {
      res.json(results);
    })
    .then(() => {
      return mongoose.disconnect()
    })
    .catch(err => {
      return next(err);
    });
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  mongoose.connect(MONGODB_URI, {useNewUrlParser:true})
    .then(() => {
        return Note.findById(id);
    })
    .then(results => {
      res.json(results);
    })
    .then(() => {
      return mongoose.disconnect()
    })
    .catch(err => {
      return next(err);
    });
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const note = req.body;
  mongoose.connect(MONGODB_URI, {useNewUrlParser:true})
    .then(() => {
        return Note.create(note);
    })
    .then(results => {
      res.location('path/to/new/document').status(201).json(results);
    })
    .then(() => {
      return mongoose.disconnect()
    })
    .catch(err => {
      return next(err);
    });
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  const update = req.body;
  mongoose.connect(MONGODB_URI, {useNewUrlParser:true})
    .then(() => {
        return Note.findByIdAndUpdate(id, {$set: update}, {new: true});
    })
    .then(results => {
      res.json(results);
    })
    .then(() => {
      return mongoose.disconnect()
    })
    .catch(err => {
      return next(err);
    });
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  mongoose.connect(MONGODB_URI, {useNewUrlParser:true})
  .then(() => {
      return Note.findByIdAndDelete(id);
  })
  .then(results => {
    res.status(204).end();
  })
  .then(() => {
    return mongoose.disconnect()
  })
  .catch(err => {
    return next(err);
  });
  
});

module.exports = router;