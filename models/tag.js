const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true}
});

mongoose.set('timestamps', true);

noteSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;
    }
});

module.exports = mongoose.model('Tag', tagSchema);