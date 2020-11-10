const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');

const uri = 'mongodb+srv://ned:toolaboy132@cluster0.juhiy.mongodb.net/Proteins?retryWrites=true&w=majority';
const app = express();
app.use(cors());
app.use(bodyParser.json())

app.get('/protein/:id', (req, res) => {
    console.log('Hit protein endpoint')
    MongoClient.connect(uri, (err, db) => {
        if (err) {
            console.log("Mongo connection error: " + err);
        }

        const id = req.params.id.toLowerCase();
        db.db('Proteins').collection('proteins').find({ name: id }).toArray((err, result) => {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.json(result);
        });
    })
});

app.get('/protein', (req, res) => {
    console.log('Hit protein endpoint')
    MongoClient.connect(uri, (err, db) => {
        if (err) {
            console.log("Mongo connection error: " + err);
        }

        const id = req.params.id;
        db.db('Proteins').collection('proteins').find().toArray((err, result) => {
            if (err) {
                res.status(500).send(err);
                return;
            }
            console.log('Result: ', result);
            res.json(result);
        });
    })
});


app.post('/protein', (req, res) => {
    console.log('POST /protein');
    console.log(req.body);
    const proteinName = req.body.proteinName.toLowerCase();
    MongoClient.connect(uri, (err, db) => {
        if (err) {
            console.log("Mongo connection error: " + err);
        }

        db.db('Proteins').collection('proteins').find({ name: proteinName }).toArray((err, result) => {
            if (err) {
                res.status(500).send(err);
                return;
            }


            if (!(result.length === 0)) {
                res.status(500).json({ err: "Protein already exists in collection" })
                return;
            }

            const newProtein = {
                name: proteinName
            }

            db.db('Proteins').collection('proteins').insertOne(newProtein, (err, result) => {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                console.log('Result: ', result);
                res.json(result);
            });
        })

    })
});



app.get('/', (req, res) => {
    res.send('hi');
});

app.listen(2000, () => { console.log('listening on port 2000') });

