const mongoose = require('mongoose');


/*const AuthorSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true}
});*/

const blogPostSchema = mongoose.Schema({
	title: {type: String, required: true},
	content: {type: String, required: true},
	/*author: {
		type: (mongoose.Schema).ObjectId,
		ref: 'Author',
		required: true
	},*/
	author:{
		firstName: String,
		lastName: String
	},
	created: {type: Date, default: Date.now}
});

blogPostSchema.virtual('fullName').get(function(){
	return `${this.author.firstName} ${this.author.lastName}`.trim();
});

blogPostSchema.methods.apiRepr = function(){
	return {
		title: this.title,
		content: this.content,
		author: this.fullName,
		created: this.created
	};
};

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
module.exports = {BlogPost};