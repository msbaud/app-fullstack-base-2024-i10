//=======[ Settings, Imports & Data ]==========================================

var PORT = 3000;

var express = require("express");
var app = express();
var utils = require("./mysql-connector");

// to parse application/json
app.use(express.json());
// to serve static files
app.use(express.static("/home/node/app/static/"));

//=======[ Main module code ]==================================================

app.get("/device/:id", function (req, res) {
  utils.query(
    "SELECT id,description FROM Devices where id=" + req.params.id,
    (error, respuesta, fields) => {
      if (error) {
        res.status(409).send(error.sqlMessage);
      } else {
        res.status(200).send(respuesta);
      }
    }
  );
});
app.get("/usuario", function (req, res) {
  res.send("[{id:1,name:'mramos'},{id:2,name:'fperez'}]");
});
//Insert
app.post("/usuario", function (req, res) {
  console.log(req.body.id);
  if (req.body.id != undefined && req.body.name != undefined) {
    //inset en la tabla
    res.send();
  } else {
    let mensaje = { mensaje: "El id o el name no estaban cargados" };
    res.status(400).send(JSON.stringify(mensaje));
  }
});

app.post("/device/", function (req, res) {
  utils.query(
    "update Devices set state=" + req.body.status + " where id=" + req.body.id,
    (err, resp, meta) => {
      if (err) {
        console.log(err.sqlMessage);
        res.status(409).send(err.sqlMessage);
      } else {
        res.send("ok " + resp);
      }
    }
  );
});

app.get("/devices/", function (req, res, next) {
  console.log("Buscando dispositivos");

  utils.query("SELECT * FROM Devices", (error, devices, fields) => {
    if (error) {
      res.status(409).send(error.sqlMessage);
    } else {
      console.log("Lista de dispositivos: ", JSON.stringify(devices));
      res.status(200).send(devices);
    }
  });
});

app.listen(PORT, function (req, res) {
  console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
