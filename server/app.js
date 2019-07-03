//const server and listener already created in index.js

//dependencies
const express = require('express');
const morgan = require('morgan');
const axios = require('axios'); 

//invoke Express
const app = express();

//apply middleware (morgan)
app.use(morgan('dev'));
var cache = {}; //cache must be defined globally so it doesnt reset every time a request runs
//handle server route
    app.get('/',function(req,res){
//define variables
        var URL = 'http://www.omdbapi.com/' 
        var title = req.query.t;
        var id = req.query.i;
        var movie = {};
//determines if there is an 'i' or 't' in the URL and says what to do with it
            if(id){                         //if the URL has an i in it, add the movie id via req.query
                URL += '?i=' + id;
                movie = id;
                //console.log(movie)
            }
            else if(title){                 //if URL has a t in it, add movie via req.query
                URL += '?t=' + title.replace(' ','%20');
                movie = title;
                //console.log(movie)
            }
            else {                          //if invalid URl, return statement
                return res.json('Invalid URL') 
            };
//pull info from OMDB using URL (with id) |or| (with title) / or grab from server cache
            if(cache[movie]){               //If movie is in the cache, return the cached movie
                res.json(cache[movie])
            }
            else {                          //If it's not in the cache, generate URL, then add to cache and return info from OMDB
                (axios.get(URL + '&apikey=8730e0e'))
                .then(response => {  
                    cache[movie] = response.data;
                    res.json(response.data);
            })  .catch(error => {           //any exceptions are returned with an error (NECESSARY TO RUN)
                //console.log(error);
                res.json('Error');
            });
        }
});

//export code in this file for use
module.exports = app;
