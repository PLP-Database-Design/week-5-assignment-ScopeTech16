const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');


dotenv.config();

const app = express();

app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


db.connect((err) => {
    // Check for errors
    if(err){
        console.log('Error Connecting to the database: ',err);
    }else{
        console.log('Connected to MYSQL server at id : ',db.threadId);
    }


    // Redirect to the view folder and the data file
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');


    // Question 1 goes here

    // Get  endpoint that retrieves all patients and displays their:patient_id, first_name, last_name, date_of_birth
    app.get('/patients', (req, res) => {
        db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients', (err, results) => {
            if(err){
                console.error("Error fetchiing data: ", err.message);
                res.status(500).send('Datbase query error');
            }else{{
                res.render('patients', {results: results});
            }}
        })
    });


    // Question 2 goes here

    // GET endpoint that displays all providers with their: first_name, last_name, provider_specialty
    app.get('/providers', (req, res) => {
        db.query('SELECT first_name, last_name, provider_specialty FROM providers', (err, results) => {
            if(err){
                console.error("Error Fetching Data: ", err.message);
                res.status(500).send('Database Query Error');
            }else{
                res.render('providers', {results: results});
            }
        })
    });


// Question 3 goes here
    app.get('/patients_by_firstname', (req, res) => {
        const first_name = req.query.first_name;
        if(!first_name){
            res.status(400).send('Please provide a first name');
        }
        db.query('SELECT * FROM patients WHERE first_name = ?', [first_name], (err, results) =>{
            if(err){
                console.error('Error connecting to the database: ', err.message)
                res.status(500).send('Database Query Error');
            }else if (results.length === 0) {
                return res.status(404).send('No patients found with the given first name');
            }else{
                res.render('patients_by_firstname', {results: results});
            }
        })
    })


// Question 4 goes here
    app.get('/provider_by_specialty', (req, res) => {
         const specialty = req.query.specialty;
         if(!specialty){
            res.status(400).send('Please provide a specialty');
         }
         db.query('SELECT * FROM providers WHERE provider_specialty=?', [specialty], (err, results) => {
            if(err){
                console.error('Error Connecting to the database: ', err.message);
                res.status(500).send('Database Query Error')
            }else if(results.length === 0){
                return res.status(404).send('No patients found with the given first name');
            }else{
                res.render('provider_by_specialty', {results: results});
            }
         })
    })



    

})






// listen to the server
const PORT = 3300;
app.listen(PORT, () => {
  console.log(`server is runnig on http://localhost:${PORT}`)

     // Step 9: Define a route test and query the data
    app.get('/', (req, res) => {
    res.send("Server started successfully, Wedding can go on.");
    });
})