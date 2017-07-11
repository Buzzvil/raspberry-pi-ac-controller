#!/usr/bin/env bash

deploy_bundle_name="lambda_bundle.zip"
lambda_function_name="buzzvil-smart-home"

echo "Cleaning up old build ..."
rm -rf ${deploy_bundle_name}

echo "Create deployment package ..."
zip -q -r ${deploy_bundle_name} .

echo "Updating Lambda function ..."
aws lambda update-function-code --function-name ${lambda_function_name} \
    --zip-file fileb://${deploy_bundle_name} \
    --publish \
    && echo "Deployment completed successfully" || (echo "Failed" && exit 1)