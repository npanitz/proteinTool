const express = require("express");
const { MongoClient, connect } = require("mongodb");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const uri =
  "mongodb+srv://ned:toolaboy132@cluster0.juhiy.mongodb.net/Proteins?retryWrites=true&w=majority";
const app = express();
app.use(cors());
app.use(bodyParser.json());

const connectMongo = (cb) => {
  return new Promise((resolve, rej) => {
    MongoClient.connect(uri, (err, db) => {
      if (err) {
        rej(err);
      } else {
        cb(db.db("Proteins"))
          .then((res) => resolve(res))
          .catch((err) => rej(err));
      }
    });
  });
};

const getProteinById = (id) => (db) => {
  return new Promise((resolve, rej) => {
    db.collection("proteins")
      .find({ name: id })
      .toArray((err, result) => {
        if (err) {
          rej(err);
        } else {
          resolve(result);
        }
      });
  });
};

const getProteinPage = (id) => (db) => {
  return new Promise((resolve, reject) => {
    db.collection("proteins")
      .find()
      .toArray((err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
  });
};

const fetchFromWiki = (proteinName) => {
  console.log("fetch from wiki");
  return new Promise((resolve, reject) => {
    fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${proteinName}?redirect=true`
    )
      .then((res) => res.json())
      .then((res) => resolve(res.extract))
      .catch((err) => {
        console.log(err);
        resolve("");
      });
  });
};

const createProtein = (proteinName) => (db) => {
  return new Promise((resolve, reject) => {
    try {
      console.log(`creating protein ${proteinName}`);
      db.collection("proteins")
        .find({ name: proteinName })
        .toArray((err, result) => {
          if (err) {
            reject(err);
          }

          if (!(result.length === 0)) {
            reject("Protein already exists in collection");
          }
          console.log("about to call fetch from wiki");
          fetchFromWiki(proteinName)
            .then((res) => {
              const newProtein = {
                name: proteinName,
                description: res,
              };

              db.collection("proteins").insertOne(newProtein, (err, result) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(result);
                }
              });
            })
            .catch((err) => {
              reject(err);
            });
        });
    } catch (err) {
      reject(err);
    }
  });
};

const updateProtein = (id, update) => (db) => {
  console.log("updating protein");
  return new Promise((resolve, reject) => {
    console.log(id, update);
    try {
      db.collection("proteins").updateOne(
        { name: id },
        { $set: update },
        (err, result) => {
          console.log("at least we got here");
          if (err) {
            console.log("error hit");
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

app.get("/protein/:id", (req, res) => {
  console.log("Hit protein endpoint");
  const id = req.params.id.toLowerCase();
  connectMongo(getProteinById(id))
    .then((result) => res.json(result))
    .catch((err) => res.status(500).json(err));
});

app.get("/protein", (req, res) => {
  console.log("Hit protein endpoint");
  const id = req.params.id;
  connectMongo(getProteinPage(id))
    .then((result) => res.json(result))
    .catch((err) => res.status(500).json(err));
});

app.post("/protein/create", (req, res) => {
  console.log("POST /protein");
  console.log(req.body);
  const proteinName = req.body.proteinName.toLowerCase();
  connectMongo(createProtein(proteinName))
    .then((result) => res.json(result))
    .catch((err) => res.status(500).json(err));
});

app.get("/", (req, res) => {
  res.send("hi");
});

app.post("/protein/update", (req, res) => {
  console.log("Posting to protein/update");
  connectMongo(updateProtein(req.body.id, req.body.update))
    .then((result) => res.json(result))
    .catch((err) => res.status(500).json(err));
});

app.listen(2000, () => {
  console.log("listening on port 2000");
});
