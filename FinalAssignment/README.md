# Data Structures
####  Fall 2018

Instructor: Aaron Hill

Nicolas Stark

# Final Assignments
_______________


## Final Assignment 1

In this assignment we scraped AA meeting data off a website, cleaned it and mapped it.
#### We did this by:
* Writing a script using 'request' to download each of the 10 pages
* Cleaning up the data with the 'cheerio' library
* Geolocating the addresses using the TAMU API
* Creating and populating a PostgreSQL database 
* Querying that database
* Using leaflet to map the locations

#### We utilized:

* Amazon AWS RDS
* Leaflet
* Cheerio
* Node.js
* request


## Final Assignment 2

In this assignment we recorded quaitative data to populate and quary a NoSQL database.
#### We did this by:
* Collecting data over the course of several weeks
* Creating and populating a DynamoDB database
* Querying the database 
* Using that query response to load a page displaying the data 

#### We utilized:

* Amazon AWS DynamoDB
* D3.js
* Node.js

## Final Assignment 3

In this assignment we used sensor data from a Particle Photon to generate a visualization
#### We did this by:

* Programming our particle photon to push light sensor data to the internet every 30 seconds
* Setting up a script to get that data from Particle and insert it into an AWS PostgreSQL database
* Retrieving the data from the database
* Writing a D3.js page to use the data to visualize when the light sensor detected light
 
#### We utilized:

* Amazon AWS RDS
* Particle Photon
* Node.js
* Express
* D3.js


