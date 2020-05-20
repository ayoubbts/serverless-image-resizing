## serverless-image-resizing

The goal of this project is to integrate the code of the following application in a cool way: https://github.com/aircall/sre-hiring-test

DevOps technical test with:

- __logs__: AWS CloudWatch & Datadog
- __tracing__: AWS X-Ray & Datadog
- __deployment framework__: Serverless Framework
- __CI/CD__: Docker
- __auth__: forthcoming

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You must have docker and docker-compose installed

* [Docker](https://docs.docker.com/get-docker/)

#### Clone this project to your local machine:

```bash
$ git clone https://github.com/ayoubbts/serverless-image-resizing.git
```

#### Go into the cloned dir:

```bash
$ cd serverless-image-resizing
```

## Deployment

### Configure secrets

#### 1. `secrets.json`

The `deploy.sh` script will autogenerate this file. No need to touch it at all.

#### 2. `secrets.env`

Add your secret keys and configuration variables here.
```env
SLS_KEY=YOUR_AWS_ACCESS_KEY
SLS_SECRET=YOUR_AWS_SECRET_KEY
STAGE=dev
REGION=eu-west-3
S3_BUCKET=ayoub-dynamic-image-resizing
```
* Do never, ever, ever commit this file!

### Run Docker Compose

```bash
$ docker-compose up --build
```
This will build the image, create a container, run the `deploy.sh` script inside the container and deploy all the resources.

The command line will log out the service endpoints and all info. What's important to note is the bucket name and URL you need to access your images. Check out [Usage](#usage).

## Usage

After the service has been deployed, you will receive a bucket endpoint. You will add a query parameter to it in order to tell it how to resize the image. The S3 bucket will behave as a public static website.

Let's upload an image so we have something to work with.

- Application URL: https://cdcov2ay1g.execute-api.eu-west-3.amazonaws.com/dev/image

You can use curl as below or even POSTMAN!

```bash
$ curl -X POST -F 'file=@postgresql.png' -F 's3Key=postgresql.png' https://cdcov2ay1g.execute-api.eu-west-3.amazonaws.com/dev/image
```

Example 1:
```
http://ayoub-dynamic-image-resizing.s3-website.eu-west-3.amazonaws.com/postgresql.png
```

Example 2:
```
http://ayoub-dynamic-image-resizing.s3-website.eu-west-3.amazonaws.com/postgresql.png_200
```

Example 3:
```
http://ayoub-dynamic-image-resizing.s3-website.eu-west-3.amazonaws.com/postgresql.png_75
```

## Credits
The original tutorial for resizing S3 images I followed can be found [here](https://aws.amazon.com/blogs/compute/resize-images-on-the-fly-with-amazon-s3-aws-lambda-and-amazon-api-gateway/)!


## Authors

See also the list of [contributors](https://github.com/ayoubbts/serverless-image-resizing/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

* Aircall.io
* Docker
* Serverless
* AWS