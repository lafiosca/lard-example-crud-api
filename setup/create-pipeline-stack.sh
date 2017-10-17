#!/bin/bash

# "set -e" makes it so if any step fails, the script aborts:
set -e

cd "${BASH_SOURCE%/*}"
source ./definitions.sh

read -s -p "GitHub OAuth Token: " GitHubOAuthToken
echo

read -p "Email address for approval notifications: " ApprovalEmail
echo

echo
echo "Creating build pipeline stack ${PipelineStack} for project ${ProjectName}"

aws cloudformation deploy \
    --template-file "$PipelineTemplateFile" \
    --stack-name "$PipelineStack" \
    --capabilities CAPABILITY_NAMED_IAM \
    --parameter-overrides \
    LardStack="$LardStack" \
    ProjectName="$ProjectName" \
    ProjectDescriptiveName="$ProjectDescriptiveName" \
    DevStack="$DevStack" \
    ProdStack="$ProdStack" \
    GitHubOwner="$GitHubOwner" \
    GitHubRepo="$GitHubRepo" \
    GitHubBranch="$GitHubBranch" \
    GitHubOAuthToken="$GitHubOAuthToken" \
    ApprovalEmail="$ApprovalEmail" \
    DevCognitoStack="$DevCognitoStack" \
    ProdCognitoStack="$ProdCognitoStack" \
    DevDynamoStack="$DevDynamoStack" \
    ProdDynamoStack="$ProdDynamoStack"

echo
echo "Done creating build pipeline stack for ${ProjectName}"
