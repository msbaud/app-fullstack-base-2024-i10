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

/**
 * @api {post} /device/new Crear un nuevo dispositivo. Asume que el estado inicial es apagado.
 */
app.post("/device/new", function (req, res) {
  const { name, description, type } = req.body;
  utils.query(
    "INSERT INTO Devices (name, description, type, state) VALUES (?, ?, ?, ?)",
    [name, description, type, false],
    (error, result) => {
      if (error) {
        res.status(409).send(error.sqlMessage);
      } else {
        res.status(201).send({
          message: "Dispositivo creado correctamente",
          id: result.insertId,
        });
      }
    }
  );
});

/**
 * @api {post} /device/ Actualizar el estado de un dispositivo.
 */
app.post("/device/", function (req, res) {
  utils.query(
    "update Devices set state=" + req.body.status + " where id=" + req.body.id,
    (err, resp, meta) => {
      if (err) {
        console.log(err.sqlMessage);
        res.status(409).send(err.sqlMessage);
      } else {
        res.status(200).json({
          message: "Dispositivo actualizado correctamente",
          id: req.body.id,
        });
      }
    }
  );
});

/**
 * @api {put} /device/:id Actualizar los datos de un dispositivo.
 */
app.put("/device/:id", function (req, res) {
  const deviceId = req.params.id;
  const { name, description, type } = req.body;
  utils.query(
    "UPDATE Devices SET name = ?, description = ?, type = ? WHERE id = ?",
    [name, description, type, deviceId],
    (error, result) => {
      if (error) {
        res.status(409).send(error.sqlMessage);
      } else {
        res
          .status(200)
          .send({ message: "Dispositivo actualizado correctamente" });
      }
    }
  );
});

/**
 * @api {get} /device/:id Obtener los datos de un dispositivo.
 */
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

/**
 * @api {delete} /device/:id Eliminar un dispositivo.
 */
app.delete("/device/:id", function (req, res) {
  const deviceId = req.params.id;
  utils.query(
    "DELETE FROM Devices WHERE id = ?",
    [deviceId],
    (error, respuesta) => {
      if (error) {
        res.status(409).send(error.sqlMessage);
      } else {
        res
          .status(200)
          .send({ message: "Dispositivo eliminado correctamente" });
      }
    }
  );
});

/**
 * @api {get} /devices Obtener una lista de dispositivos configurados.
 */
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
  console.log("NodeJS API funciona correctamente");
});

//=======[ End of file ]=======================================================
