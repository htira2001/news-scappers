let mongoose = require("mongoose");
// Save a reference to the Schema constructor //
let Schema = mongoose.Schema;
// Using the Schema constructor, create a new UserSchema object 
let ArticleSchema = new Schema({

    title: {
        type: String,
    },

    link: {
        type: String,
    },

    summary: {
        type: String,
    },

    saved: {
        type: Boolean,
        default: false
    },

    note: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
});

// This creates model from the above schema, using mongoose's model method //

let Article = mongoose.model("Article", ArticleSchema);

// Export the Article Model //

module.exports = Article;