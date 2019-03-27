let mongoose = require('mongoose');
//save a reference to the schema constructor
let Schema = mongoose.Schema;
//Using the Schema constructor, create a new NoteChema object
//it is similar to the Sequelize model
let NoteSchema = new Schema({
    body: {
        type: String
    },
    article: {
        type: Schema.Types.ObjectId,
        ref: 'Article'
    }
});
//This creates our model from the above schema, using mongoose model method
let Note = mongoose.model('Note', NoteSchema);
//Export the Note model
modulemodule.exports = Note;