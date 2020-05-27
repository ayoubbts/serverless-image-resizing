exports.handler = (evt, ctx, callback) => {
    const authorizationHeader = evt.headers.Authorization;
  
    if (!authorizationHeader) {
      return callback("Unauthorized");
    }
  
    const encodedCreds = authorizationHeader.split(" ")[1];
    const [username, password] = Buffer.from(encodedCreds, "base64")
      .toString()
      .split(":");
  
    if (
      username !== process.env.AUTH_USERNAME ||
      password !== process.env.AUTH_PASSWORD
    ) {
      return callback("Unauthorized");
    }
  
    callback(null, buildAllowAllPolicy(evt, username));
  };
  
  function buildAllowAllPolicy(evt, principalId) {
    const tmp = evt.methodArn.split(":");
    const apiGatewayArnTmp = tmp[5].split("/");
    const awsAccountId = tmp[4];
    const awsRegion = tmp[3];
    const restApiId = apiGatewayArnTmp[0];
    const stage = apiGatewayArnTmp[1];
    const apiArn = `arn:aws:execute-api:${awsRegion}:${awsAccountId}:${restApiId}/${stage}/*/*`;
    const policy = {
      principalId,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: [apiArn]
          }
        ]
      }
    };
  
    return policy;
  }