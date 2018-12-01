const Tag = require('../models/tag');
const Note = require('../models/note');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
    Tag.find()
        .sort({ name: 'desc' })
        .then(results => {
        res.json(results);
        })
        .catch(err =>  next(err));
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).send('Tag not found.')
    }
    Tag.findById(id)
      .then(results => {
        res.json(results);
      })
      .catch(err => next(err));
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
    const tag = req.body;
    if(!tag.name){
        res.status(400).send('Tag must have a name.')
    }
    Tag.create(tag)
      .then(results => {
        res.location(`/api/tags/${tag._id}`).status(201).json(results);
      })
      .catch(err => {
        if (err.code === 11000) {
          err = new Error('The tag name already exists');
          err.status = 400;
        }
        next(err);
      });
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
    const id = req.params.id;
    const update = req.body;
    if(!update.name){
        res.status(400).send('Tag must have a name.')
    }
    if(!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).send('Tag not found.')
    }
    Tag.findByIdAndUpdate(id, {$set: update}, {new: true})
      .then(results => {
        res.json(results);
      })
      .catch(err => {
        if (err.code === 11000) {
          err = new Error('The tag name already exists');
          err.status = 400;
        }
        next(err);
      });
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    Tag.findByIdAndDelete(id)
        .then(() => {
            return Note.updateMany({}, {$pull: {tags: id}})
        })
        .then((results) => {
        res.status(204).json(results);
        })
        .catch(err => next(err));
});

module.exports = router;