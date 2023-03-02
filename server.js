let express = require("express");
let path = require("path");
let fs = require("fs");
let MongoClient = require("mongodb").MongoClient;
let bodyParser = require("body-parser");
let app = express();
const port = 3000;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/profile-picture", function (req, res) {
  let img = fs.readFileSync(path.join(__dirname, "images/profile-1.jpg"));
  res.writeHead(200, { "Content-Type": "image/jpg" });
  res.end(img, "binary");
});

// use when starting application locally
let mongoUrlLocal = "mongodb://admin:password@mongodb:27017?authSource=admin";

// use when starting application as docker container
let mongoUrlDocker = "mongodb://admin:password@mongodb";

// pass these options to mongo client connect request to avoid DeprecationWarning for current Server Discovery and Monitoring engine
let mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };

// "user-account" in demo with docker. "my-db" in demo with docker-compose
let databaseName = "my-db";

app.post("/update-profile", function (req, res) {
  let userObj = req.body;

  MongoClient.connect(
    mongoUrlLocal,
    mongoClientOptions,
    function (err, client) {
      if (err) throw err;

      let db = client.db(databaseName);
      userObj["userid"] = 1;

      let myquery = { userid: 1 };
      let newvalues = { $set: userObj };

      db.collection("users").updateOne(
        myquery,
        newvalues,
        { upsert: true },
        function (err, res) {
          if (err) throw err;
          client.close();
        }
      );
    }
  );
  // Send response
  res.send(userObj);
});

app.get("/get-profile", function (req, res) {
  let response = {};
  // Connect to the db
  MongoClient.connect(
    mongoUrlLocal,
    mongoClientOptions,
    function (err, client) {
      if (err) throw err;

      let db = client.db(databaseName);

      let myquery = { userid: 1 };

      db.collection("users").findOne(myquery, function (err, result) {
        if (err) throw err;
        response = result;
        client.close();

        // Send response
        res.send(response ? response : {});
      });
    }
  );
});

app.listen(port, function () {
  console.log(`app listening on port ${port}`);
});

// const express = require("express");
// const MongoClient = require("mongodb").MongoClient;
// const port = 4000;

// const app = express();

// const url =
//   "mongodb://admin:password@mongodb:27017/mydatabase?authSource=admin";

// let mongoOptions = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// };
// try {
//   MongoClient.connect(url, mongoOptions);
//   console.log("Successfully connected to the database");
// } catch (err) {
//   console.log({ err });
//   console.log("could not connect to mongodb database");
// }

// app.get("/", (req, res) => {
//   res.send("Hi!");
// });

// app.listen(port, () => {
//   console.log(`server is listening on ${port}`);
// });
