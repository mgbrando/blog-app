const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const blogsRouter = require('./blogs-router');
const {DATABASE_URL, PORT} = require('./config');
const app = express();
app.use(morgan('common'));

app.use('/blog-posts', blogsRouter);

let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT){
	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl, err => {
			if(err)
				return reject(err);

			server = app.listen(port, () => {
				console.log(`Your app is listening on port ${port}`);
				resolve(server);
			}).on('error', err => {
				reject(err);
			});
		});
	});
}

function closeServer(){
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log('Closing server...');
			server.close(err => {
				if(err){
					reject(err);
					return;
				}
				resolve();
			});
		});
	});
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};