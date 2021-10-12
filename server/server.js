require("./config/config");

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

app.use(function(req, res, next) {

    res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, PUT, GET, DELETE, OPTIONS");
    next();
});

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

app.use(bodyParser.json());

//habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, "../public")));

// Configuracion global de rutas
app.use(require("./routes/index"));

mongoose.connect(
    process.env.URLDB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    },
    (err, res) => {
        if (err) throw err;
        console.log("Base de datos online");
    }
);

app.listen(process.env.PORT, () =>
    console.log("Escuchando puerto:", process.env.PORT)
);