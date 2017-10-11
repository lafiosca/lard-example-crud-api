#!/bin/bash

# "set -e" makes it so if any step fails, the script aborts:
set -e

cd "${BASH_SOURCE%/*}"
source ./definitions.sh

echo
echo "Creating Dynamo resource stacks for ${ProjectName}"

echo
echo "1. Creating Dynamo development resource stack ${DevDynamoStack}"

aws cloudformation deploy \
    --template-file $DynamoTemplateFile \
    --stack-name $DevDynamoStack \
    --parameter-overrides \
    ParentStack=$DevStack \
    NotesRCU=$DevNotesRCU \
    NotesWCU=$DevNotesWCU

echo
echo "2. Creating Dynamo production resource stack ${ProdDynamoStack}"

aws cloudformation deploy \
    --template-file $DynamoTemplateFile \
    --stack-name $ProdDynamoStack \
    --parameter-overrides \
    ParentStack=$ProdStack \
    NotesRCU=$ProdNotesRCU \
    NotesWCU=$ProdNotesWCU

echo
echo "Done creating Dynamo resource stacks for ${ProjectName}"

