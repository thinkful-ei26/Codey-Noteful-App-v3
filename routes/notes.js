'use strict';

const Note = require('../models/note');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const {searchTerm, folderId} = req.query;

  let filter = {};
  if (searchTerm) {
    const re = new RegExp(searchTerm, 'i');
    filter = {$or: [{ 'title': re }, { 'content': re }] };
  }
  if (folderId) {
    
  }
  Note.find(filter)
    .sort({ updatedAt: 'desc' })
    .then(results => {
      res.json(results);
    })
    .catch(err =>  next(err));
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  Note.findById(id)
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const note = req.body;
  if(note.folderId) {
    if(!mongoose.Types.ObjectId.isValid(note.folderId)) {
      res.status(404).send('Folder not found.')
    }
  }
  Note.create(note)
    .then(results => {
      res.location(`/api/notes/${note._id}`).status(201).json(results);
    })
    .catch(err => next(err));
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  const update = req.body;
  if(update.folderId) {
    if(!mongoose.Types.ObjectId.isValid(update.folderId)) {
      res.status(404).send('Folder not found.')
    }
  }
  Note.findByIdAndUpdate(id, {$set: update}, {new: true})
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  Note.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end();
    })
    .catch(err => next(err));
});

module.exports = router;