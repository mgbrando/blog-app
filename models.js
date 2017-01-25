const mongoose = require('mongoose');


const AuthorSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true}
});

const blogPostSchema = mongoose.Schema({
	title: {type: String, required: true},
	content: {type: String, required: true},
	author: {
		type: Schema.ObjectId,
		ref: Author,
		required: true
	},
	created: {type: Date, default: Date.now}
});

blogPostSchema.virtual('fullName').get(function(){
	return `${this.firstName} ${this.lastName}`.trim();
});

blogSchema.methods.apiRepr = function(){
	return {
		title: this.title,
		content: this.content,
		author: this.fullName,
		created: this.created
	};
};

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
module.exports = {BlogPost};