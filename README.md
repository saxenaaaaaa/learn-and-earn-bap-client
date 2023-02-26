# Learn And Earn Bap Client

# Developer Guide

## Steps to run the server on local machine
#### Prerequisites
```
Install Node 19.6.0 using a version manager like nvm / nvm-windows : 
  i. install nvm
  ii. nvm install 19.6.0
  iii. nvm use 19.6.0

```
#### Local Setup
```
1. Clone this repository: - https://github.com/saxenaaaaaa/learn-and-earn-bap-client
2. Run “npm install” 
3. Run “npm run build” 
4. Run “npm run dev” 
5. Server is up and running on http://localhost:3000 .All apis can be called using Postman / swagger e.t.c.

```

# User Guide

Welcome to LearnAndEarn App!
This app can be used to look for -
  1. Courses and Trainings
  2. Jobs and Internships
  
In this app, 
  1. We have linked Learning Resources with realtime list of Job postings relevant for a particular learning resource. This helps build aspirations in Students/Professions to acquire new skills or upgrade their skills.
  
  2. We have also done vice-versa i.e. reverse linkage of Job postings with the list of Course/Training offerings that may be relevant in achieving the eligibility of a particular Job.
  
Apart from this, the usual lifecycle of Searching for Courses/Trainings/Jobs/Internships, selecting a particular entry and it fulfillment are possible through this app.

To illustrate the links, we have added [this postman collection](https://github.com/saxenaaaaaa/learn-and-earn-bap-client/blob/main/sample-requests-postman-collection.json) to the repository. These API requests illustrate how:
  1. A search for courses returns a list of Course objects with each object enriched with a list of Jobs which might be relevant to that course.
  2. A search for jobs returns a list of Job Objects with each object enriched with a list of courses that might be relevant for that Job.
  
# Product Documentation

See [product documentation here](https://docs.google.com/document/d/1DKhMlGlBv3NkWEKQfld7krnjwBGQBQZEND8cZmdirC0/edit?usp=sharing)

