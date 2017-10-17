'use strict';

const Promise = require('bluebird');
const AWS = require('aws-sdk');
const _ = require('lodash');
const { api } = require('lard-lambda-handler');

AWS.config.setPromisesDependency(Promise);

const dynamo = new AWS.DynamoDB.DocumentClient();

const notesTable = process.env.DynamoTableNotes;

const fetchNotes = () => {
	console.log('Fetch all notes');
	const scan = {
		TableName: notesTable,
		ReturnConsumedCapacity: 'TOTAL',
	};
	return dynamo.scan(scan)
		.promise()
		.then((response) => {
			console.log(`Consumed: ${response.ConsumedCapacity}`);
			return response.Items.map(note => _.pick(note, ['id', 'title']));
		})
		.catch((error) => {
			console.error(`SCAN FAILED:\n${JSON.stringify(scan, null, 2)}`);
			throw error;
		});
};

const translateResponse = notes => ({
	statusCode: 200,
	headers: {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': 'Content-Type,Authorization',
		'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
	},
	body: {
		data: _.orderBy(notes, ['title'], ['asc']),
	},
});

exports.handler = api((event) => {
	console.log(`Event:\n${JSON.stringify(event, null, 2)}`);
	return fetchNotes()
		.then(translateResponse)
		.catch((error) => {
			console.error(`API ERROR: ${error}`);
			throw error;
		});
});
