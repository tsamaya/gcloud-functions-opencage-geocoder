# gcloud-functions-opencage-geocoder


following the previous turotial with [AWS Lambda](https://github.com/tsamaya/aws-lambda-opencage-geocoder), here is the Google Cloud Funtions version


## Tutorial

### Google - Credentials
The Serverless Framework needs access to account credentials for your Google Cloud account so that it can create and manage resources on your behalf.

#### Create a Google Cloud Billing Account
You need a Billing Account with a credit card attached to use Google Cloud Functions. Here's how to create one:

Click here, to go to the screen to create a new Billing Account.
Enter the name of the Billing Account and enter your billing information. Then click Submit to enable billing.
A Billing Account will exist already offering you a free trial. Please note that this will not work for Google Cloud Functions. Only a Billing Account with a valid credit card will work.
If necessary, a more detailed guide on creating a Billing Account can be found here.

#### Create a new Google Cloud Project
A Google Cloud Project is required to use Google Cloud Functions. Here's how to create one:

Go to the Google Cloud Console.
There is a dropdown near the top left of the screen (near the search bar that lists your projects). Click it and select "Create Project".
Enter a Project name and select the Billing Account you created in the steps above (or any Billing Account with a valid credit card attached).
Click on "Create" to start the creation process.
Wait until the Project was successfully created and Google will redirect you to your new Project.
Verify your currently within your new Project by looking at the dropdown next to the search bar. This should mark your new Project as selected.

#### Enable the necessary APIs
You need to enable the following APIs so that Serverless can create the corresponding resources.

Go to the API dashboard, select your project and enable the following APIs (if not already enabled):

Google Cloud Functions
Google Cloud Deployment Manager
Google Cloud Storage
Stackdriver Logging

#### Get credentials
You need to create credentials Serverless can use to create resources in your Project.

Go to the Google Cloud API Manager and select "Credentials" on the left.
Click on "Create credentials" and select "Service account key".
Select "New service account" in the "Service account" dropdown.
Enter a name for your "Service account name" (e.g. "serverless-framework").
Select "Project" --> "Owner" as the "Role".
The "Key type" should be "JSON".
Click on "Create" to create your private key.
That's your so called keyfile which should be downloaded on your machine.
Save the keyfile somewhere secure. We recommend making a folder in your root folder and putting it there. Like this, ~/.gcloud/keyfile.json. You can change the file name from keyfile to anything. Remember the path you saved it to.

##### Update the provider config in serverless.yml
Open up your serverless.yml file and update the provider section with your Google Cloud Project id and the path to your keyfile.json file (this path needs to be absolute!). It should look something like this:

provider:
  name: google
  runtime: nodejs
  project: my-serverless-project-1234
  credentials: ~/.gcloud/keyfile.json



  $ serverless create --template google-nodejs --path gcloud-functions-opencage-geocoder

  Serverless: Generating boilerplate...
  Serverless: Generating boilerplate in "/Users/tsamaya/work/github/tsamaya/gcloud-functions-opencage-geocoder"
   _______                             __
  |   _   .-----.----.--.--.-----.----|  .-----.-----.-----.
  |   |___|  -__|   _|  |  |  -__|   _|  |  -__|__ --|__ --|
  |____   |_____|__|  \___/|_____|__| |__|_____|_____|_____|
  |   |   |             The Serverless Application Framework
  |       |                           serverless.com, v1.26.1
   -------'

  Serverless: Successfully generated boilerplate for template: "google-nodejs"
  
  tsamaya@MBP-de-arnaud ~/work/github/tsamaya/gcloud-functions-opencage-geocoder $ npm install
  npm notice created a lockfile as package-lock.json. You should commit this file.
  npm WARN google-nodejs@0.1.0 No repository field.

  added 81 packages from 85 contributors in 102.568s
  tsamaya@MBP-de-arnaud ~/work/github/tsamaya/gcloud-functions-opencage-geocoder $ yarn
  yarn install v1.5.1
  info No lockfile found.
  [1/4] 🔍  Resolving packages...
  [2/4] 🚚  Fetching packages...
  [3/4] 🔗  Linking dependencies...
  [4/4] 📃  Building fresh packages...
  success Saved lockfile.
  ✨  Done in 13.21s.
  tsamaya@MBP-de-arnaud ~/work/github/tsamaya/gcloud-functions-opencage-geocoder $ sls deploy
  Serverless: Packaging service...
  Serverless: Excluding development dependencies...
  Serverless: Compiling function "first"...
  Serverless: Creating deployment...
  Serverless: Checking deployment create progress...
  ...
  Serverless: Done...
  Serverless: Uploading artifacts...
  Serverless: Artifacts successfully uploaded...
  Serverless: Updating deployment...
  Serverless: Checking deployment update progress...
  ..................
  Serverless: Done...
  Service Information
  service: gcloud-functions-opencage-geocoder
  project: ocd-315303
  stage: dev
  region: us-central1

  Deployed functions
  first
    https://us-central1-ocd-315303.cloudfunctions.net/http

  tsamaya@MBP-de-arnaud ~/work/github/tsamaya/gcloud-functions-opencage-geocoder $ curl https://us-central1-ocd-315303.cloudfunctions.net/http
  Hello World!tsamaya@MBP-de-arnaud ~/work/github/tsamaya/my-service $
