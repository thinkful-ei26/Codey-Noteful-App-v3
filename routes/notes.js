'use strict';

const Note = require('../models/note');
const Tag = require('../models/tag');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const {searchTerm, folderId, tagId} = req.query;

  let filter;
  let re;
  if (searchTerm) {
    re = new RegExp(searchTerm, 'i');
    filter = {$or: [{ 'title': re }, { 'content': re }] };
  }
  if (folderId) {
    filter = {folderId};
  }
  if (tagId) {
    filter = {tags: {$in: [tagId]}};
  }
  if(folderId && tagId) {
    filter = { '$and': [
      {folderId},
      {tags: {$in: [tagId]}},
    ]}
  }
  if(searchTerm && folderId && tagId) {
    filter = { '$and': [
      {folderId},
      {tags: {$in: [tagId]}},
      {$or: [{ 'title': re }, { 'content': re }] }
    ]}
  }
  
  Note.find(filter)
    .populate('tags')
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
    .populate('tags')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const note = req.body;
  const tags = req.body.tags;
  if(note.folderId) {
    if(!mongoose.Types.ObjectId.isValid(note.folderId)) {
      res.status(404).send('Folder not found.')
    }
  }
  if(tags) {
    tags.forEach(tag => {
      if(!mongoose.Types.ObjectId.isValid(tag)) {
        res.status(400).send('Invalid tag/s.')
      }
    });
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
  const tags = req.params.tags;
  const update = req.body;
  if(update.folderId) {
    if(!mongoose.Types.ObjectId.isValid(update.folderId)) {
      res.status(404).send('Folder not found.')
    }
  }
  if(tags) {
    tags.forEach(tag => {
      if(!mongoose.Types.ObjectId.isValid(tag)) {
        res.status(400).send('Invalid tag/s.')
      }
    });
  }
  Note.findByIdAndUpdate(id, update, {new: true})
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