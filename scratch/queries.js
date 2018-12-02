const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config');

const Note = require('../models/note');

// find by search term
mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
  .then(() => {
    const searchTerm = 'It is important';
    let filter = {};

    if (searchTerm) {
      filter.title = { $regex: searchTerm, $options: 'i' };
      filter.content = { $regex: searchTerm, $options: 'i' };
    }

    return Note.find({$or: [ {title: filter.title}, {content: filter.content} ]})
        .sort({ updatedAt: 'desc' });
  })
  .then(results => {
    console.log(results);
  })
  .then(() => {
    return mongoose.disconnect()
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });

// find by id
mongoose.connect(MONGODB_URI, {useNewUrlParser:true})
  .then(() => {
      const id = '000000000000000000000004';

      return Note.findById(id);
  })
  .then(results => {
    console.log(results);
  })
  .then(() => {
    return mongoose.disconnect()
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });

//create note
mongoose.connect(MONGODB_URI, {useNewUrlParser:true})
  .then(() => {
      const note = {
          title: 'This is a note about stuff',
          content: 'This is the content part of the note. It is important.'
      };

      return Note.create(note);
  })
  .then(results => {
    console.log(results);
  })
  .then(() => {
    return mongoose.disconnect()
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });

// update note by id
mongoose.connect(MONGODB_URI, {useNewUrlParser:true})
  .then(() => {
      const id = '5bfd9f4cbd97e3334c92109d';
      const update = {
        "title": "This is a note",
        "content": "This is the content part of the note. It has been updated."
      };

      return Note.findByIdAndUpdate(id, {$set: update});
  })
  .then(results => {
    console.log(results);
  })
  .then(() => {
    return mongoose.disconnect()
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });

// delete not by id
mongoose.connect(MONGODB_URI, {useNewUrlParser:true})
  .then(() => {
      const id = '5bfd9f4cbd97e3334c92109d';

      return Note.findByIdAndDelete(id);
  })
  .then(results => {
    console.log(results);
  })
  .then(() => {
    return mongoose.disconnect()
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });