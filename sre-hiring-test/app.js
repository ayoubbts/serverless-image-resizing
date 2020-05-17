const AWS = require('aws-sdk')
const sharp = require('sharp');
const parser = require('./parser');

const s3 = new AWS.S3();

let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.lambdaHandler = async (event, context) => {

    const S3_BUCKET = process.env.S3_BUCKET;

    const image_max_size = 456;
    const image_sizes = [image_max_size,200,75];
    var img_buffer;
    var s3_key;

    try {
        if (event.path && event.path == "/image") {
            const { body } = await parser.parse(event);
            s3_key = body.s3Key;
            img_buffer = body.files[0].file;
        } else {
            throw Error("Method not supported");
        }

        const promises = image_sizes.map(async image_size => {
            const crop_img_buffer = await resize_image(img_buffer,image_size);
            let s3_key_image;
            if (image_size !== image_max_size){
                s3_key_image = s3_key + '_' + image_size;
            } else {
                s3_key_image = s3_key;
            }
            await send_image(crop_img_buffer,S3_BUCKET,s3_key_image);
        })

        await Promise.all(promises);

        response = {
            'statusCode': 200,
            'body': "ok",
            'headers': {
                'Content-Type': 'application/text',
                'Access-Control-Allow-Origin': '*'
            }
        }
    } catch (error) {
        console.error(error)
        response = {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/text',
                'Access-Control-Allow-Origin': '*'
            },
            'body': JSON.stringify({
                message: 'unable to crop image',
            })
        }
    }

    return response
};

async function resize_image(img_buffer,size) {
    
    try {
        var img_corp_buffer = await sharp(img_buffer)
            .resize(size, size, {
                withoutEnlargement: true
            })
            .jpeg()
            .toBuffer()
    } catch (error) {
        console.error("Unable to resize image");
        console.error(error);
        throw Error(error);
    }

    return img_corp_buffer
}

async function send_image(crop_img_buffer,s3_bucket,s3_key){
    try {
        const params = {
            ACL: 'public-read',
            Bucket: s3_bucket,
            Key: s3_key,
            Body: crop_img_buffer,
            ContentType: 'image/jpeg'
        };
        await s3.putObject(params).promise();
        console.log("image : ", s3_key," sent to : ",s3_bucket)
    } catch (error) {        
        console.error("Unable to upload : ",s3_key," to bucket : ",s3_bucket);
        throw Error(error);
    }
}