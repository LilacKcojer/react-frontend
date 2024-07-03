/**
 * @fileoverview
 *
 * This CloudFormation Trigger creates a handler which awaits the other handlers
 * specified in the `MODULES` env var, located at `./${MODULE}`.
 */

/**
 * The names of modules to load are stored as a comma-delimited string in the
 * `MODULES` env var.
 */
const moduleNames = process.env.MODULES.split(',');
/**
 * The array of imported modules.
 */
const modules = moduleNames.map((name) => require(`./${name}`));

/**
 * This async handler iterates over the given modules and awaits them.
 *
 * @see https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html#nodejs-handler-async
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 *
 */
exports.handler = async (event, context) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const email = event.requestContext.userAttributes.email;

  const postData = JSON.stringify({
      email: email
  });

  const options = {
      method: 'POST',
      headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
      },
      body: postData
  };
  const response = await fetch("https://huix8w2yq5.execute-api.us-west-2.amazonaws.com/prod/users", options)
  const data = await response.json();
    
  console.log(data);
  await Promise.all(modules.map((module) => module.handler(event, context)));
  return event;
};
