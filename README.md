# gcloud-functions-opencage-geocoder

After the previous turotial with [AWS Lambda](https://github.com/tsamaya/aws-lambda-opencage-geocoder), here is now the Google Cloud Functions version.

This repository shows how to create an Google Cloud function to proxy OpenCage Geocoder API.

Why a function as a service to wrap a REST API? You may don't want to expose your own OpenCage API key to your client end users, analyze requests sent to Open Cage, etc. So here is a solution to proxy the requests on your own infrastructure.

## Tutorial

In this tutorial we will be using the serverless framework from  [serverless.com](https://serverless.com/).

We will first need a Google account to activate the Google Cloud Plateform.

### Prerequisites
- node, npm or yarn

- serverless: for convenience install it globally:

    $ npm install -g serverless

Assuming serverless has been setup globally, the sls and serverless commands are available.

### Google - Credentials
The Serverless Framework needs access to account credentials for your Google Cloud account so that it can create and manage resources on your behalf.

#### Create a Google Cloud Account
We need a Billing Account with a credit card attached to use Google Cloud Functions. Here's how to create one:

- [Create](https://console.cloud.google.com/billing/create) the account.
- Enter the name of the Billing Account and enter your billing information. And click Submit to enable billing.
- A new Billing Account will offer you a free trial.

If necessary, a more detailed guide on creating a Billing Account can be found [here](https://cloud.google.com/billing/docs/how-to/manage-billing-account?hl=en&visit_id=636744942214468658-3501342868&rd=1).

#### Create a new Google Cloud Project
A Google Cloud Project is required to use Google Cloud Functions. Here's how to create one:

- Go to the Google Cloud [Console](https://console.cloud.google.com/).
- There is a dropdown near the top left of the screen (near the search bar that lists your projects). Click it and select `Create Project`.
- Enter a Project name and select the Billing Account you created in the steps above.
- Click on `Create` to start the creation process.
- Wait until the Project was successfully created and Google will redirect you to your new Project.
- Verify your currently within your new Project by looking at the dropdown next to the search bar. This should mark your new Project as selected.

#### Enable the necessary APIs
You need to enable the following APIs so that Serverless can create the corresponding resources.

Go to the `API dashboard`, select your project and enable the following APIs:
- Google Cloud Functions
- Google Cloud Deployment Manager
- Google Cloud Storage
- Stackdriver Logging

#### Get credentials
You need to create credentials Serverless can use to create resources in your Project.

- Go to the `Google Cloud API Manager` and select `Credentials` on the left.
- Click on `Create credentials` and select `Service account key`.
- Select `New service account` in the `Service account` dropdown.
- Enter a name for your `Service account name` (e.g. "opencage-function").
- Select `Project` --> `Owner` as the `Role`.
- `Key type` is `JSON`.
- Click on `Create` to create your private key.
- The so called `keyfile` will be downloaded on your machine.
- Save the keyfile somewhere secure. I recommend making a folder in your home folder and putting it there; like this, `~/.gcloud/keyfile.json`. You can change the file name from keyfile to anything according to the goolge project name. Just remember the path you saved it to!


### Create a new serverless boilerplate

serverless will help up us to bootstrap the project with the command

```
$ serverless create --template google-nodejs --path gcloud-functions-opencage-geocoder
```

will output this:

```
  Serverless: Generating boilerplate...
  Serverless: Generating boilerplate in "/Users/tsamaya/work/github/tsamaya/gcloud-functions-opencage-geocoder"
   _______                             __
  |   _   .-----.----.--.--.-----.----|  .-----.-----.-----.
  |   |___|  -__|   _|  |  |  -__|   _|  |  -__|__ --|__ --|
  |____   |_____|__|  \___/|_____|__| |__|_____|_____|_____|
  |   |   |             The Serverless Application Framework
  |       |                           serverless.com, v1.32.0
   -------'

  Serverless: Successfully generated boilerplate for template: "google-nodejs"
```

```
$ cd gcloud-functions-opencage-geocoder/

$ ls -al
```

will output this directory structure

```
.
├── .gitignore
├── index.js
├── package.json
└── serverless.yml
```

### lock down the framework version

    $ npm i -D serverless


### Update the service name in `serverless.yml`
Open up your `serverless.yml` file and update the service name

```
service: opencage-geocoder
```

### Update the provider config in `serverless.yml`
Open up your `serverless.yml` file and update the provider section with your Google Cloud Project id and the path to your `keyfile` file. It should look something like this:

```
provider:
  name: google
  runtime: nodejs8
  project: opencage-123456
  credentials: ~/.gcloud/keyfile.json
  region: us-central1
```

Like in the example above, feel free to use node Plateform version 8 instead of 6. Google Cloud funciton are not generally available, here the `region` parameter is set to `us-central1` which point to the only available location while I am writing this tutorial.

### install dependencies
We will hide OpenCage Geocoder API key and we will set it in an environment file, so we will use the `dotenv` library, then the OpenCage API request will be held by the `opencage-api-client` library

```
$ npm i -S opencage-api-client dotenv
```

### serverless helpers
Serverless comes will some useful plugins, We will use the environment generator file plugin

```
$ npm i -D serverless-env-generator
```

Edit `serverless.yml` file, adding this after `provider:` section

```
plugins:
  - serverless-google-cloudfunctions
  - serverless-env-generator

# Plugin config goes into custom:
custom:
  envFiles: #YAML files used to create .env file
    - environment.yml
```

### Environment variable

Use serverless env generator to create `environment.yml` file

```
$ serverless env --attribute OCD_API_KEY --value <YOUR-OPEN-CAGE-API-KEY> --stage dev
```

```
Serverless: Successfuly set OCD_API_KEY 🎉
```

now let's generate a `.env` file.

```
$ serverless env generate
```

```
Serverless: Creating .env file...
```

### Lets code it:

Open the `index.js` file and remove its content. Replace it by :

```
require('dotenv').config();
const opencage = require('opencage-api-client');

exports.geocode = (request, response) => {
  if (!request.query) {
    response.status(400).send({error: 400, message: "Couldn't read query parameters"});
    return;
  }

  if (typeof process.env.OCD_API_KEY === 'undefined' && typeof request.query.key === 'undefined') {
    response.status(403).send({error: 403, message: 'missing API key'});
    return;
  }
  const query = request.query;
  query.key = process.env.OCD_API_KEY;
  opencage.geocode(query).then(data => {
    response.status(200).send(data);
  }).catch(err => {
    response.status(400).send({error: 400, message: err.statusText});
  });
};

```

### edit serverless handler

As we exported `opencage` from our module, we have to specify it in the serverless yml file. `opencage` will be the function name, `geocode` is the handler and we will use `geocode` for the path

```
functions:
  opencage:
    handler: geocode
    events:
      - http: geocode
```


### deploy

```
$ serverless deploy
```

```
Serverless: Creating .env file...
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Removed .env file
Serverless: Compiling function "opencage"...
Serverless: Creating deployment...
Serverless: Checking deployment create progress...
..
Serverless: Done...
Serverless: Uploading artifacts...
Serverless: Artifacts successfully uploaded...
Serverless: Updating deployment...
Serverless: Checking deployment update progress...
..........
Serverless: Done...
Service Information
service: opencage-geocoder
project: opencage-199303
stage: dev
region: us-central1

Deployed functions
opencage
  https://us-central1-opencage-123456.cloudfunctions.net/geocode
```

### test

```
$ curl --request GET \
  --url 'https://us-central1-opencage-123456.cloudfunctions.net/geocode?q=Picadilly%20Circus%20London'
```
