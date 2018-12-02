'use strict';

const Folder = require('../models/folder');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
    Folder.find()
        .sort('name')
        .then(results => {
        res.json(results);
        })
        .catch(err =>  next(err));
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).send('Folder not found.')
    }
    Folder.findById(id)
      .then(results => {
        res.json(results);
      })
      .catch(err => next(err));
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
    const folder = req.body;
    if(!folder.name){
        res.status(400).send('Folder must have a name.')
    }
    Folder.create(folder)
      .then(results => {
        res.location(`/api/folders/${folder._id}`).status(201).json(results);
      })
      .catch(err => {
        if (err.code === 11000) {
          err = new Error('The folder name already exists');
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
        res.status(400).send('Folder must have a name.')
    }
    if(!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).send('Folder not found.')
    }
    Folder.findByIdAndUpdate(id, update, {new: true})
      .then(results => {
        res.json(results);
      })
      .catch(err => {
        if (err.code === 11000) {
          err = new Error('The folder name already exists');
          err.status = 400;
        }
        next(err);
      });
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    Folder.findByIdAndDelete(id)
      .then(() => {
        res.status(204).end();
      })
      .catch(err => next(err));
});

module.exports = router;