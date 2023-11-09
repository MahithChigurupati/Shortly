# Shortly - URL Shortener Application

**Author:** 
[MahithChigurupati](https://github.com/MahithChigurupati)<br>
**Role:** 
Backend Developer<br>
**Email:** chigurupati.sa@northeastern.edu

## Project Overview

Shortly is a URL shortener application designed to develop server-side logic for shortening URLs, handle databases, and ensure high performance and responsiveness to requests from the front-end.

## Features

A URL shortener is a service used by users to shorten long, hard-to-remember URLs into easy-to-share shortened redirects. 

In this project, I have implemented the following features:

1. An endpoint that takes a long URL and returns a shortened URL with a random short ending.
2. An endpoint that returns a history of all URLs shortened by a given user.
3. Short URLs actually redirect to their corresponding long URLs.
4. Implemented tier-based request limits. For example, Tier 1 users can make up to 1000 requests, while Tier 2 users can make only 100 requests.
5. Allowing users to optionally create their preferred custom URLs.

## Additional Information

- Redirection to Original URL on GET call of shortly URL in browser with 301 status code(permanent redirection)
- GET /shortly/user/getAllMyUrl will return all the urls created by a user based on user's basic authentication
- use basic authentication to getUser, customizeUrl, getAllUrl using username and password used during user creation
- Sample JSON request and response body are given below
- customize URL will optionally accepts a user defined shortly url key, if not provided system will generate a random shortly url key
- if you need your shortly url to be something like http://{baseUrl}/:shortly_url , only pass shortly_url parameter key in customizeUrl   POST body optionally
- log messages will be in logs directory
- use env.example to setup environment variables
- make sure you have postgres installed in your machine

User Tier Structure:
- Tier 1: 1000 requests
- Tier 2: 500 requests
- Tier 3: 100 requests

## Getting Started

To get started with Shortly, follow these steps:

1. Clone this repository to your local machine.
2. Set up the required environment and dependencies.
3. Test and verify that the application works as expected.

## Instructions to run the Project:

- Clone this git repo using ssh- `git@github.com:MahithChigurupati/Shortly.git`
- Clone this git repo using ssh- `https://github.com/MahithChigurupati/Shortly.git`

Run following commands:
  
```JAVASCRIPT
// install dependancies
npm i 

// run test (basic test to check DB connection)
npm test

// run the project
npm start

```

## Tools used:
- pg : postgres DB is used for this project
- sequelize : An ORM library for Node.js for database interactions, schema creation and querying
- winston : a library that handles any logs to debug any issues in production
- moment : for creating timestamps
- chai : testing framework
- bcrypt : a library to securely hash passwords

you can also run following command to install all the dependancies

```
npm i bcrypt dotenv express moment winston chai supertest pg sequelize
```

## Endpoint URLs for User Schema

``` JavaScript
//Health check EndPoint 
GET /healthz

//Get user Account Information 
GET /user/{userId}

//Create a User Account 
POST /user
```

## Sample JSON Request for POST Method

```JSON
{ 
  "first_name": "Jane",
  "last_name": "Doe",
  "username": "jane.doe@example.com",
  "password": "password",
  "user_tier": "1",
}
```

## Sample JSON Response for GET Method

``` JSON
{
  "id": 1,
  "first_name": "Jane",
  "last_name": "Doe",
  "username": "jane.doe@example.com",
  "user_tier": 1,
  "requests_available": 1000,
  "account_created": "2023-11-08T17:15:27.2727",
  "account_updated": "2023-11-08T17:15:27.2727"
}
```

## Endpoint URLs for URLS Schema

``` JavaScript

//POST Method to customize URL
POST /shortly/customizeUrl

//GET Method to get original URL from customized URL
GET /shortly/{url}

//GET Method to get all the shortly URLs created by a user
GET /shortly/user/getAllMyUrl

```


## Sample JSON Request for POST Method to customize URL

``` JSON
{
    "original_url": "https://github.com/MahithChigurupati/Shortly/blob/main/README.md",
    "shortly_url": "tramly"
}
```


``` JSON
{
    "original_url": "https://github.com/MahithChigurupati/Shortly/tree/main#getting-started",
}
```

## Sample JSON Response for GET All Method

``` JSON
[
  {
    "id": 1,
    "user_id": 1,
    "original_url": "https://github.com/MahithChigurupati/Shortly/blob/main/README.md",
    "shortly_url": "tramly"
  },
  {
    "id": 2,
    "user_id": 1,
    "original_url": "https://github.com/MahithChigurupati/Shortly/tree/main#getting-started",
    "shortly_url": "8zkxf"
  },
  {
    "id": 3,
    "user_id": 1,
    "original_url": "https://github.com/MahithChigurupati/Shortly/tree/main#features",
    "shortly_url": "erecx"
  }
]

```
