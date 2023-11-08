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

## Getting Started

To get started with Shortly, follow these steps:

1. Clone this repository to your local machine.
2. Set up the required environment and dependencies.
3. Test and verify that the application works as expected.

## Instructions to run the Project:


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
POST /shortly/customizeUrl/{url}

//GET Method to get original URL from customized URL
GET /shortly/{url}

//GET Method to get all the shortly URLs created by a user
GET /shortly/{user_id}

```

## Sample JSON Request for GET Method
``` JSON
{
    "id": 1,
    "user_id": 1,
    "original_url": "https://github.com/MahithChigurupati/Shortly/blob/main/README.md",
    "shortly_url": "https://www.shortly.me/tramly"
}
```

## Sample JSON Response for GET All Method
``` JSON
[
  {
     "id": 1,
    "user_id": 1,
    "original_url": "https://github.com/MahithChigurupati/Shortly/blob/main/README.md",
    "shortly_url": "https://www.shortly.me/tramly"
  },
  {
    "id": 2,
    "user_id": 1,
    "original_url": "https://github.com/MahithChigurupati/Shortly/tree/main#getting-started",
    "shortly_url": "https://www.shortly.me/gstart"
  },
  {
     "id": 1,
    "user_id": 3,
    "original_url": "https://github.com/MahithChigurupati/Shortly/tree/main#features",
    "shortly_url": "https://www.shortly.me/xyz"
  }
]

```

## Additional Information
