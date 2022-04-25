//imports
    let express = require('express');
    let mongodb = require('mongodb');
    let router = express.Router();
//database
    let database = `demo`;
    let connectionString = 'mongodb://localhost:27017/' + database;
    
//generics
    //CRUD examples (for reference only)
        //read
            router.post('/getDocument', async (req, res) => {
            //get params
                let collection = await loadCollection(req.body.collection);
                let query = { _id: req.body.item._id };
            //build document
                let document = await collection.findOne(query);
            //return
                res.send(document);
            }); 

        //create/update
            router.post('/setDocument', async (req, res) => {
            //get params
              
                let collection = await loadCollection(req.body.collection);
                let query = { _id: req.body.item._id };
                let options = { //insert if doesn't exist
                    upsert: true,
                };
            //build document
                let replace = req.body.item;
                await collection.replaceOne(query, replace, options);
            //return
                res.status(201).send();
            });

        //delete

            router.post('/deleteDocument', async (req, res) => {
            //get params
                let collection = await loadCollection(req.body.collection);
                let query = { _id: req.body.item._id };
            //execute query
                await collection.deleteOne(query);
            //returnf
                res.status(201).send();
            }); 

            /*CODE BELOW IS THE CODE THAT WAS SUPPOSED TO BE MODIFIED */
            //customs


        /*Delete user function */
        //delete user
        router.post('/deleteUser', async (req, res) => {
            //get params
            //execute query
            //return
            const collection = await loadCollection("users");
            let query = { username:req.body.username};
            //build document
            let document = await collection.deleteOne(query);
                res.status(201).send();
        }); 


    /*  REGISTERING THE USER */

        router.post('/setUser', async (req, res) => {
            //get params
            //execute query
            //return.
            console.log(req.body);
            
       //     let query = { _id: req.body.item._id };
                const posts = await loadCollection("users");
                await posts.insertOne({
                    username: req.body.username,
                    fruit : req.body.fruit,

                })

                
                res.status(201).send();
               
            }); 

        /* GET function to get the data */
         //get access token. getting the access token
        // this is where we are vaildating the data
        router.post('/getToken', async (req, res) => {
            //console.log(req.body);
        
            const collection = await loadCollection("users");
            let query = { username:req.body.username , fruit:req.body.fruit};
            //build document
            let document = await collection.findOne(query);
            console.log("We're are printing the document now.")
            console.log(document);
            if(document=== null){
                res.send();
               
            }
            else{
                res.send(true);
                

            }
            //get params
            //execute query
            //return
          
             //   res.status(201).send(result);

                // code to validate the data and make the button disapper

        });
    
     /* This is the code to connect to the database */
     //database
    // this is the connection to the database. 
        async function loadCollection(collection){
            let client = await mongodb.MongoClient.connect(connectionString, {
                useNewUrlParser: true
            });
            return client.db(database).collection(collection);
        }
        // * fetch("/api/posts/your-path-here", { .. }) 
//export
    module.exports = router;