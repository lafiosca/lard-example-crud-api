#!/bin/bash

# "set -e" makes it so if any step fails, the script aborts:
set -e

uuidgenPath=`which uuidgen` || ! echo 'uuidgen not found in path'
echo "Using ${uuidgenPath}"

cd "${BASH_SOURCE%/*}"
source ./definitions.sh

echo
echo "Creating Cognito resource stacks for ${ProjectName}"

echo
echo "1. Creating development Cognito resource stack ${DevCognitoStack}"

aws cloudformation deploy \
    --template-file $CognitoTemplateFile \
    --stack-name $DevCognitoStack \
    --capabilities CAPABILITY_NAMED_IAM \
    --parameter-overrides \
    ParentStack=$DevStack \
    UserPoolSmsExternalId=`uuidgen`

echo
echo "2. Creating production Cognito resource stack ${ProdCognitoStack}"

aws cloudformation deploy \
    --template-file $CognitoTemplateFile \
    --stack-name $ProdCognitoStack \
    --capabilities CAPABILITY_NAMED_IAM \
    --parameter-overrides \
    ParentStack=$ProdStack \
    UserPoolSmsExternalId=`uuidgen`

echo
echo "Done creating Cognito resource stacks for ${ProjectName}"

