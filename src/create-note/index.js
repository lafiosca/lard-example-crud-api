'use strict';

const Promise = require('bluebird');
const _ = require('lodash');
const httpErrors = require('http-errors');
const uuid = require('uuid/v4');
const AWS = require('aws-sdk');
const { api } = require('lard-lambda-handler');

AWS.config.setPromisesDependency(Promise);

const dynamo = new AWS.DynamoDB.DocumentClient();

const notesTable = process.env.DynamoTableNotes;

const prepareNote = (event) => {
	if (!event.body || !_.isPlainObject(event.body.data)) {
		throw new httpErrors.BadRequest('Missing required body data');
	}

	const { data } = event.body;

	if (!_.isString(data.title)) {
		throw new httpErrors.BadRequest('Missing required note title');
	}

	if (!_.isString(data.text)) {
		throw new httpErrors.BadRequest('Missing required note text');
	}

	const note = _.assign(
		{ id: uuid() },
		_.mapValues(
			_.pick(data, ['title', 'text']),
			_.trim
		)
	);

	if (note.title === '') {
		throw new httpErrors.BadRequest('Note title cannot be empty');
	}

	return note;
};

const putNote = (note) => {
	console.log(`Creating note ${note.id}`);

	const put = {
		TableName: notesTable,
		Item: note,
		ReturnConsumedCapacity: 'TOTAL',
	};

	return dynamo.put(put)
		.promise()
		.then((response) => {
			console.log(`Consumed: ${response.ConsumedCapacity}`);
			return note;
		})
		.catch((error) => {
			console.error(`PUT FAILED:\n${JSON.stringify(put, null, 2)}`);
			throw error;
		});
};

const translateResponse = note => ({
	statusCode: 200,
	headers: {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': 'Content-Type,Authorization',
		'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
	},
	body: { data: note },
});

exports.handler = api((event) => {
	console.log(`Event:\n${JSON.stringify(event, null, 2)}`);
	return prepareNote(event)
		.then(putNote)
		.then(translateResponse)
		.catch((error) => {
			console.error(`API ERROR: ${error}`);
			throw error;
		});
});
