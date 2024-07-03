
const http = require('http');



/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    const postData = JSON.stringify({
        email: 'sample@gmail.com'
    });

    const options = {
        hostname: 'huix8w2yq5.execute-api.us-west-2.amazonaws.com',
        path: '/prod/users',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };
    
    const makePost = (postData) => {
        let data = '';
    
        const request = http.request(options, (response) => {
            response.setEncoding('utf8');
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', ()=>{
                console.log(data);
            });
        });
    
        request.on('error', (error)=>{
            console.error(error);
        });
    
        request.write(postData);
        request.end();
    
        return data;
    };
    res = makePost(postData);
    return {
        statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  },
        body: res,
    };
};
