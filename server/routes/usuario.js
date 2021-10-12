const express = require("express");

const bcrypt = require("bcryptjs");
const _ = require('underscore');
const cors = require('cors');
let app = express();
app.use(cors({ origin: '*' }));

let Usuario = require("../models/usuario");

//=====================================
//mostrar todos los usuarios
//=====================================

app.get("/usuarios", (req, res) => {
    //traer todos los usuarios

    let desde = req.query.desde || 0;
    desde = Number(desde);
    Usuario.find().exec((err, usuarios) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err,
            });
        }
        res.json({
            ok: true,
            usuarios,
        });
    });
});

//=====================================
//obtener un usuario por id
//=====================================

app.get("/usuarios/:id", (req, res) => {
    let id = req.params.id;
    Usuario.findById(id).exec((err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: "el id no existe",
                },
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB,
        });
    });
});

//=====================================
//crear un nuevo usuario
//=====================================

app.post("/usuarios", (req, res) => {
    let body = req.body;
    let usuario;

    if (body.facebook === 'true') {
        usuario = new Usuario({
            nombre: body.nombre,
            correo: body.correo,
            tipo:'CLIENTE',
            facebook: body.facebook
        });
    } else {
        usuario = new Usuario({
            nombre: body.nombre,
            correo: body.correo,
            tipo: body.tipo,
            password: bcrypt.hashSync(password, 10)
        });
    }

    usuario.save((err, usuarioBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioBD,
        });
    });
});

// =====================================
// Buscar un usuario x correo
// =====================================

app.get("/usuarios/buscar/:termino", (req, res) => {
    let termino = req.params.termino;
    Usuario.findOne({
        correo: termino,
    }).exec((err, usuarios) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!usuarios) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: "el usuario no existe",
                },
            });
        }

        res.json({
            ok: true,
            usuarios,
        });
    });
});

//=====================================
//actualizar usuario.
//=====================================

app.put("/usuarios/:id", (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Usuario.findByIdAndUpdate(
        id, {
            new: true,
            runValidators: true,
        },
        (err, usuarioBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (!usuarioBD) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        mensaje: "no existe el usuario con este id en la base de datos",
                    },
                });
            }
            usuarioBD.nombre = body.nombre;
            usuarioBD.correo = body.correo;
            usuarioBD.password = bcrypt.hashSync(body.password, 10);

            usuarioBD.save((err, usuarioGuardado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err,
                    });
                }
                res.json({
                    ok: true,
                    usuario: usuarioGuardado,
                });
            });
        }
    );
    // grabar el usuario
    // grabar una categoria del listado
});


app.put('/usuarios/password/:idusuario', function(req, res) {
    let idusuario = req.params.idusuario;
    let body = req.body;

    Usuario.findOne({ _id: idusuario }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar Usuario',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.passwordAnt, userDB.password)) {
            return res.status(400).json({
                ok: false,
                message: 'Contraseñas no coinciden',
                errors: err
            });
        }

        let bodyNew = _.pick(body, ['password']);

        if (bodyNew.password != null) {
            bodyNew.password = bcrypt.hashSync(bodyNew.password, 10);
        }

        Usuario.findByIdAndUpdate(idusuario, bodyNew, { new: true, runValidators: true }, (err, userDB) => {
            console.log(userDB);
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            userDB.password = null;

            res.json({
                ok: true,
                usuario: userDB
            });
        });
    });
});

//=====================================
//actualizar usuario sin password
//=====================================

app.put("/usuarios-sin-password/:id", (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Usuario.findByIdAndUpdate(
        id, {
            new: true,
            runValidators: true,
        },
        (err, usuarioBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (!usuarioBD) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        mensaje: "no existe el usuario con este id en la base de datos",
                    },
                });
            }
            usuarioBD.nombre = body.nombre;
            usuarioBD.correo = body.correo;
            // usuarioBD.password = bcrypt.hashSync(body.password, 10);

            usuarioBD.save((err, usuarioGuardado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err,
                    });
                }
                res.json({
                    ok: true,
                    usuario: usuarioGuardado,
                });
            });
        }
    );
    // grabar el usuario
    // grabar una categoria del listado
});


// FIRE BASE TOKENS
// ADDS
app.post('/usuarios/fcm/:id', (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let fcm = body.fcm;

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            return res.status(400).send({
                statusMessage: 'Bad Request',
                error: err
            });
        }
        if (!usuarioDB.fcm.includes(fcm)) {
            usuarioDB.fcm.push(fcm);
            usuarioDB.save((err, usuarioUpdatedDB) => {
                if (err) {
                    return res.status(400).send({
                        statusMessage: 'Bad Request',
                        error: err
                    });
                }
                return res.status(200).send({
                    statusMessage: 'Successful',
                    message: 'FCM added',
                    FCM: usuarioUpdatedDB.fcm
                });
            });
        } else {
            return res.status(409).send({
                statusMessage: 'Conflict',
                message: 'FCM already exists'
            });
        }
    });
});

//=====================================
//borrar carrito
//=====================================

// app.delete("/carritos/:id", (req, res) => {
//     let id = req.params.id;
//     Carrito.findByIdAndRemove(id, (err, carritoDB) => {
//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 err,
//             });
//         }
//         if (!carritoDB) {
//             return res.status(400).json({
//                 ok: false,
//                 err: {
//                     mensaje: "el id no existe",
//                 },
//             });
//         }
//         res.json({
//             ok: true,
//             mensaje: "Carrito eliminado",
//         });
//     });
// });
//=====================================
//borrar todos los carritos
//=====================================

// app.delete("/carritos", (req, res) => {
//     Carrito.remove((err, carritoDB) => {
//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 err,
//             });
//         }
//         if (!carritoDB) {
//             return res.status(400).json({
//                 ok: false,
//                 err: {
//                     mensaje: "el id no existe",
//                 },
//             });
//         }
//         res.json({
//             ok: true,
//             mensaje: "Carritos eliminado",
//         });
//     });
// });
//=====================================
//borrar carrito x producto
//=====================================

// app.delete("/carritos/buscar/:id", (req, res) => {
//     let id = req.params.id;
//     Carrito.findOneAndRemove({
//         'producto': id
//     }, (err, carritoDB) => {
//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 err,
//             });
//         }
//         if (!carritoDB) {
//             return res.status(400).json({
//                 ok: false,
//                 err: {
//                     mensaje: "el id no existe",
//                 },
//             });
//         }
//         res.json({
//             ok: true,
//             mensaje: "Carrito eliminado",
//         });
//     });
// });

// =====================================
// Buscar un carrito x producto
// =====================================

// app.get("/carritos/buscar/:termino", (req, res) => {
//     let termino = req.params.termino;
//     Carrito.find({
//             'producto': termino,
//         }).populate({
//             path: 'producto',
//             populate: {
//                 path: 'categoria'
//             }
//         })
//         .exec((err, productos) => {
//             if (err) {
//                 res.status(500).json({
//                     ok: false,
//                     err,
//                 });
//             }

//             res.json({
//                 ok: true,
//                 productos,
//             });
//         });
// });
//=====================================
//Sumar un producto
//=====================================

// app.get("/carritos-suma", (req, res) => {
//     console.log(res.json);
//     Carrito.aggregate([{
//         $group: {
//             _id: {},
//             total: {
//                 $sum: {
//                     $multiply: ["$subtotal", "$cantidad"]
//                 }
//             }
//         }
//     }]).exec((err, total) => {
//         if (err) {
//             res.status(500).json({
//                 ok: false,
//                 err,
//             });
//         }
//         res.json({
//             ok: true,
//             total,
//         });
//     });

// });
//=====================================
//Contar productos del carrito
//=====================================

// app.get("/carritos-count", (req, res) => {
//     console.log(res.json);
//     Carrito.count().exec((err, total) => {
//         if (err) {
//             res.status(500).json({
//                 ok: false,
//                 err,
//             });
//         }
//         res.json({
//             ok: true,
//             total,
//         });
//     });

// });

//=====================================
//Filtrar un producto
//=====================================

// app.get("/productos/buscar/:termino", (req, res) => {
//     let termino = req.params.termino;
//     let regex = new RegExp(termino, "i");
//     Producto.find({
//             nombre: regex,
//         })
//         .sort("nombre")
//         .populate('categoria', 'descripcion')
//         .exec((err, productos) => {
//             if (err) {
//                 res.status(500).json({
//                     ok: false,
//                     err,
//                 });
//             }

//             res.json({
//                 ok: true,
//                 productos,
//             });
//         });
// });

module.exports = app;