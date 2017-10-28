# lard-example-crud-api

An example project demonstrating a serverless REST API deployment using [Lard](https://github.com/lafiosca/lard).

## Pre-Installation

* Lard and AWS preparation
  1. Follow all the directions in the [Lard](https://github.com/lafiosca/lard) README.

* GitHub preparation
  1. Create a [personal OAuth access token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/) with full `repo` and full `admin:repo_hook` access.

## Installation

1. Fork this repository.

2. Clone your forked repository locally and change into its directory.

3. Edit `setup/definitions.sh` as needed:

    `LardStack`: the name of your Lard stack (default: "Lard")

    `GitHubOwner`: the GitHub owner username from your forked repository (your username)

    `GitHubRepo`: the GitHub repository name from your forked repository (default: "lard-example-crud-api")

    `GitHubBranch`: the branch you would like to deploy from (default: "master")

    You may edit the other values as you wish, but it's recommended to leave them unchanged for the example.

4. Run `setup/create-dynamo-stacks.sh` to create the development and production Dynamo resource CloudFormation stacks. These are named `Dynamo-Dev-LardExampleCrudApi` and `Dynamo-Prod-LardExampleCrudApi` by default.

5. Run `setup/create-cognito-stacks.sh` to create the development and production Cognito resource CloudFormation stacks. These are named `Cognito-Dev-LardExampleCrudApi` and `Cognito-Prod-LardExampleCrudApi` by default.

6. Run `setup/create-pipeline-stack.sh` to create the CodePipeline API deployment CloudFormation stack. This will prompt you for your GitHub OAuth token (created in the pre-installation steps) and an email address for receiving deployment approval notifications. By default, the stack will be named `Pipeline-LardExampleCrudApi`, and it will create a new pipeline named `LardExampleCrudApi` in CodePipeline.

As soon as the final step is successfully completed, you should be able to visit [CodePipeline](https://console.aws.amazon.com/codepipeline/) in the AWS web console and see the new pipeline. If your OAuth access token was set up correctly, your pipeline should immediately pull the source code from your forked repository and build the REST API. It will deploy the development stack, named `Dev-LardExampleCrudApi` by default, and then it will email you to ask for production deployment approval. If you manually grant approval in the CodePipeline UI, it will then deploy the production stack, named `Prod-LardExampleCrudApi` by default.

The development and production stacks will each create an API in API Gateway with default names of `Dev-LardExampleCrudApi` and `Prod-LardExampleCrudApi` respectively. Each API will include a stage named `Api` which has a full set of CRUD methods on a "Notes" resource stored in Dynamo.

For more information on using these APIs, see the web application companion example project [lard-example-crud-web](https://github.com/lafiosca/lard-example-crud-web).

## Cleanup

The resources created by this project may incur costs on your AWS account. In particular, Dynamo table resources are charged based on capacity. The default RCU/WCU values in this project should stay well within the bounds of the [Free Tier pricing](https://aws.amazon.com/dynamodb/pricing/#free-tier), but if you increase the values or already have Dynamo tables in your account, you may want to tidy up quickly. To do this, enter [CloudFormation](https://console.aws.amazon.com/cloudformation/) in the AWS web console and delete the stacks in this sequence (default names):

1. API stacks: `Dev-LardExampleCrudApi` and `Prod-LardExampleCrudApi` (if created)
2. Pipeline stack: `Pipeline-LardExampleCrudApi`
3. Cognito stacks: `Cognito-Dev-LardExampleCrudApi` and `Cognito-Prod-LardExampleCrudApi`
4. Dynamo stacks: `Dynamo-Dev-LardExampleCrudApi` and `Dynamo-Prod-LardExampleCrudApi`

Pay special care to ensure that the API stacks are completely deleted before you delete the Pipeline stack that created them. If the Pipeline is deleted beforehand, it will remove a crucial IAM role that CloudFormation needs for completing deletion of the API stacks. (If this occurs anyway because you were deleting things willy-nilly without reading, you should be able to recreate the Pipeline stack then delete them in the proper order.)
