'use strict';

const Promise = require('bluebird');
const AWS = require('aws-sdk');
const { api } = require('lard-lambda-handler');

AWS.config.setPromisesDependency(Promise);

const dynamo = new AWS.DynamoDB.DocumentClient();

const notesTable = process.env.DynamoTableNotes;

const pickNoteId = event => event.pathParameters.noteId;

const deleteNote = (noteId) => {
	console.log(`Deleting note ${noteId}`);

	const params = {
		TableName: notesTable,
		Key: { id: noteId },
		ReturnConsumedCapacity: 'TOTAL',
	};

	return dynamo.delete(params)
		.promise()
		.catch((error) => {
			console.error(`DELETE FAILED:\n${JSON.stringify(params, null, 2)}`);
			throw error;
		})
		.then((response) => {
			console.log(`Consumed: ${response.ConsumedCapacity}`);
			return noteId;
		});
};

const translateResponse = () => ({
	statusCode: 200,
	headers: {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': 'Content-Type,Authorization',
		'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
	},
	body: { data: {} },
});

exports.handler = api((event) => {
	console.log(`Event:\n${JSON.stringify(event, null, 2)}`);
	return pickNoteId(event)
		.then(deleteNote)
		.then(translateResponse)
		.catch((error) => {
			console.error(`API ERROR: ${error}`);
			throw error;
		});
});
