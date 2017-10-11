#!/bin/bash

ProjectName=LardExampleCrudApi
ProjectDescriptiveName="Lard example CRUD API"

DevStack=Dev-${ProjectName}
ProdStack=Prod-${ProjectName}

PipelineTemplateFile=pipeline-resources.json
CognitoTemplateFile=cognito-resources.json
DynamoTemplateFile=dynamo-resources.json

PipelineStack=Pipeline-${ProjectName}

DevCognitoStack=Cognito-${DevStack}
ProdCognitoStack=Cognito-${ProdStack}

DevDynamoStack=Dynamo-${DevStack}
ProdDynamoStack=Dynamo-${ProdStack}


## Pipeline-specific variables

LardStack=Lard

GitHubOwner=lafiosca
GitHubRepo=lard-example-crud-api
GitHubBranch=master

ApprovalEmail=joe@lafiosca.com


## Dynamo-specific variables

DevNotesRCU=1
DevNotesWCU=1

ProdNotesRCU=1
ProdNotesWCU=1

