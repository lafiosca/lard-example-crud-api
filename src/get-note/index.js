'use strict';

const Promise = require('bluebird');
const AWS = require('aws-sdk');
const _ = require('lodash');
const httpErrors = require('http-errors');
const { api } = require('lard-lambda-handler');

AWS.config.setPromisesDependency(Promise);

const dynamo = new AWS.DynamoDB.DocumentClient();

const notesTable = process.env.DynamoTableNotes;

const fetchNote = (event) => {
	const { noteId } = event.pathParameters;
	console.log(`Fetch note id ${noteId}`);

	const query = {
		TableName: notesTable,
		KeyConditionExpression: 'id = :noteId',
		ExpressionAttributeValues: {
			':noteId': noteId,
		},
		ReturnConsumedCapacity: 'TOTAL',
	};

	return dynamo.query(query)
		.promise()
		.then(response => {
			console.log(`Consumed: ${response.ConsumedCapacity}`);
			if (response.Items.length === 0) {
				throw new httpErrors.NotFound(`No note found with id ${noteId}`);
			}
			return response.Items[0];
		})
		.catch(error => {
			console.error(`QUERY FAILED:\n${JSON.stringify(query, null, 2)}`);
			throw error;
		});
};

const translateResponse = note => ({
	statusCode: 200,
	headers: {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': 'Content-Type,Authorization',
		'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
	},
	body: { data: note },
});

exports.handler = api((event) => {
	console.log(`Event:\n${JSON.stringify(event, null, 2)}`);
	return fetchNote(event)
		.then(translateResponse)
		.catch((error) => {
			console.error(`API ERROR: ${error}`);
			throw error;
		});
});
