
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const express = require('express');
const router = express.Router();

const {BlogPost} = require('./models');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

/*BlogPosts.create('The Only Book', 'Everything', 'Matthew Brando', Date.now());
BlogPosts.create('The Jungle Book', 'A kid and animals', 'Some person', Date.now());*/

function checkFields(requestBody, requiredFields){
	for(let i = 0; i <requiredFields.length; i++){
		const field = requiredFields[i];
		if(!(field in requestBody)){
			const message = `\`${field}\` property missing in request.`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
}

router.get('/', (req, res) => {
	res.json(BlogPosts.get());
});

router.get('/:id', (req, res) => {
	res.json(BlogPosts.get(req.params.id));
});

router.post('/', jsonParser, (req, res) => {
	checkFields(req.body, ['title', 'content', 'firstName', 'lastName']);
	res.status(201).json(BlogPosts.create(
		req.body.title,
		req.body.content,
		req.body.author,
		req.body.publishDate || null
	));
});

router.delete('/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Deleted blog post with ID of \`${req.params.id}\``);
	res.status(204).end();
});

router.put('/:id', jsonParser, (req, res) => {
	checkFields(req.body, ['title', 'content', 'firstName', 'lastName']);
	if(req.params.id !== req.body.id){
		const message = `Path id \`${req.params.id}\` and request body id`
		 `\`${req.body.id}\` must be the same.`;
		console.error(message);
		res.status(400).send(message);
	}
	res.status(200).json(BlogPosts.update({
		id: req.body.id,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		publishDate: req.body.publishDate || null
	}));
});

//New ones
router.get('/', (req, res) => {
	BlogPost
		.find()
		.exec()
		.then(blogPosts => {
			res.status(200).json({
				blogPosts: blogPosts.map(blogPost => {
					blogPost.apiRepr();
				});
			});
		})
		.catch(err => {
			console.error(err);
        	res.status(500).json({message: 'Internal server error'});
		});
});

router.get('/:id', (req, res) => {
	BlogPost
		.findById(req.params.id)
		.exec()
		.then(blogPost => {
			res.status(200).json({
				blogPost.apiRepr();
			});
		})
		.catch(err => {
			console.error(err);
        	res.status(500).json({message: 'Internal server error'});
		});
});

router.post('/', jsonParser, (req, res) => {
	checkFields(req.body, ['title', 'content', 'firstName', 'lastName']);
	BlogPost
		.create({
			title: req.body.title,
			content: req.body. content,
			author:{
				firstName: req.body.firstName,
				lastName: req.body.lastName
			}
			created: req.body.created || Date.now()
		})
		.exec()
		.then(blogPost => {
			res.status(201).json({
				blogPost.apiRepr();
			});
		})
		.catch(err => {
			console.error(err);
        	res.status(500).json({message: 'Internal server error'});
		});
});

router.delete('/:id', (req, res) => {
	BlogPost
		.findByIdAndRemove(req.params.id)
		.exec()
		.then(blogPost => {
			console.log(`Deleted blog post with ID of \`${req.params.id}\``);
			res.status(204).end();
		})
		.catch(err => {
			console.error(err);
        	res.status(500).json({message: 'Internal server error'});
		});
});

router.put('/:id', jsonParser, (req, res) => {
	checkFields(req.body, ['title', 'content', 'firstName', 'lastName']);
	if(!(req.params.id && req.body.id && req.params.id === req.body.id)){
		const message = `Path id \`${req.params.id}\` and request body id`
		 `\`${req.body.id}\` must be the same.`;
		console.error(message);
		res.status(400).send(message);
	}
	toUpdate = {};
	updatableFields = ['title', 'content', 'firstName', 'lastName']
	updatableFields.forEach(field => {
		if(field in req.body)
			toUpdate[field] = req.body[field];
	});
	BlogPost
		.findByIdAndUpdate(req.params.id, {$set: toUpdate})
		.exec()
		.then(blogPost => {
			res.status(200).json({
				blogPost.apiRepr();
			});
		})
		.catch(err => {
			console.error(err);
        	res.status(500).json({message: 'Internal server error'});
		});
});

module.exports = router;