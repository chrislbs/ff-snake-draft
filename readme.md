# Simple Snake Draft Application #

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/884c932a0b3e41bf991d5ab6f2d09f07)](https://www.codacy.com/app/corey_3/ff-snake-draft?utm_source=github.com&utm_medium=referral&utm_content=chrislbs/ff-snake-draft&utm_campaign=badger)

## Requirements ##

- [nodejs](https://nodejs.org/en/)
- [mysql](http://dev.mysql.com/downloads/mysql/)

## Setup ##

### Installing the node modules ###

```npm install```

### Loading data into the database ###

At present, the application assumes that the mysql server is running on the local machine on the 
default port (3306). It also assumes that a database named 'ff' ```create database if not exists ff```
exists for the user you're connecting as.

Most of the API's will automatically create the expected table structures required whenever first 
making a request to one of the API's. 

The player projection data is being scraped off of a [fantasy analytics](http://apps.fantasyfootballanalytics.net/projections)
site. The application currently has no background processing so to retrieve an initial set of data
you should start the server and hit the data import API. I'm using ```node nodemon app.js```.

```POST http://localhost:8080/api/data/importLatest```


### Running with Docker & Fabric ###

Install fabric to build images and run containers easily
```bash
pip install fabric
```

Run:
* `fab build` to build/pull docker images
* `fab dev` to run all containers, with the main container in interactive mode
* `fab up` to run all containers in daemon mode
