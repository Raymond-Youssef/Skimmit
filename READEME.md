# Mondelez API

## Getting Started

### Installing Dependencies

#### Node.js 14.x

Follow instructions to install the latest version of Node.js for your platform in the [Node.js Website](https://nodejs.org/)
After installation, make sure you have Node and npm installed by running the following commands:

```bash
node --version
npm --version
```

If the version of each of them appears, they are installed correctly.

#### npm Dependencies

Once you have Node.js and npm installed, install dependencies by opening a command prompt and run the following command:

```bash
npm install
```

This will install all the required packages within the `package.json` file.

##### Key Dependencies

- [Express.Js](https://expressjs.com/)  is a lightweight backend microservices framework. Express is required to handle requests and responses.

- [MongoDB](https://www.mongodb.com/) is a lightweight NoSQL database that is used to store data as documents. 

- [Mongoose](https://mongoosejs.com/) is a MongoDB ODM that we will use to handle connection to MongoDB.

- [Passport.Js](http://www.passportjs.org/) is a node module used to control Authentication/Authorization in the application.

## Application Setup
With Node.Js and MongoDB installed, you will need to set your environment variables by doing the following:
- Create a new file in the main directory with the name `.env`.
- Copy the contents of the `.env.example` to the newly-created `.env` file.
- Fill the marked spaces with your own environment variables.
* Note: You can uncomment the line `#NODE_ENV=production` to set the Node Environment to production.

## Running the server

From within the directory run the following command for development environment:

```bash
npm run start-dev
```

OR this command for production environment:

```bash
npm run start-prod
```

this will start the server on your local environment on a specific PORT.

## Testing
Tests can be run using [Postman](https://www.postman.com/)
Import the collection in the file `Mondelez.postman_collection.json` to Postman then run your tests,
but make sure you set your base_url.

## API Reference
* Base URL: this application is deployd on [Heroku](https://www.heroku.com/) with a base url `https://protected-peak-76158.herokuapp.com/`.
However, if you run it locally it will be hosted at the default, `http://127.0.0.1:3000/`.
* API Documentation: You can find full API documentation here [Mondelez API Documentation](https://documenter.getpostman.com/view/12538552/TVzRGJLA)
* Authentication: A full explanation of the authentication techniques in the full API Documentation.