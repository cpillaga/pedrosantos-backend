const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');

let app = express();

let Carrito = require("../models/carrito");
app.use(cors({ origin: '*' }));

//=======================================
//mostrar todos los carritos por usuario
//=======================================

app.get("/carritos-usuario/:id", (req, res) => {
    //traer todos los productos
    let id = req.params.id;
    let desde = req.query.desde || 0;
    desde = Number(desde);
    Carrito.find({
            usuario: id
        })
        .populate({
            path: 'producto',
            populate: {
                path: 'subcategoria'
            }
        }).populate('usuario')
        .exec((err, carritos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            res.json({
                ok: true,
                carritos,
            });
        });
});

//=====================================
//obtener un carrito por id
//=====================================

app.get("/carritos/:id", (req, res) => {
    let id = req.params.id;
    Carrito.findById(id)
        .populate({
            path: 'producto',
            populate: {
                path: 'subcategoria'
            }
        })
        .exec((err, carritoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            if (!carritoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        mensaje: "el id no existe",
                    },
                });
            }
            res.json({
                ok: true,
                carrito: carritoDB,
            });
        });
});

//=====================================
//crear un nuevo carrito
//=====================================
app.post("/carritos", (req, res) => {
    let body = req.body;
    let carrito = new Carrito({
        cantidad: body.cantidad,
        producto: body.producto,
        subtotal: body.subtotal,
        usuario: body.usuario,
    });

    carrito.save((err, carritoBD) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err,
            });
        }
        res.status(201).json({
            ok: true,
            carrito: carritoBD,
        });
    });
});

//=====================================
//actualizar carrito
//=====================================

app.put("/carritos/:id", (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Carrito.findByIdAndUpdate(
        id, {
            new: true,
            runValidators: true,
        },
        (err, carritoBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (!carritoBD) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        mensaje: "no existe el carrito con este id en la base de datos",
                    },
                });
            }
            carritoBD.cantidad = body.cantidad;
            carritoBD.producto = body.producto;
            carritoBD.subtotal = body.subtotal;

            carritoBD.save((err, carritoGuardado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err,
                    });
                }
                res.json({
                    ok: true,
                    carrito: carritoGuardado,
                });
            });
        }
    );
    //grabar el usuario
    //grabar una categoria del listado
});

//=====================================
//borrar carrito
//=====================================

app.delete("/carritos/:id", (req, res) => {
    let id = req.params.id;
    Carrito.findByIdAndRemove(id, (err, carritoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!carritoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: "el id no existe",
                },
            });
        }
        res.json({
            ok: true,
            mensaje: "Carrito eliminado",
        });
    });
});
//========================================
//borrar todos los carritos de un usuario
//========================================

app.delete("/carritos-usuario/:id", (req, res) => {
    let id = req.params.id;

    Carrito.remove({
        usuario: id
    }, (err, carritoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!carritoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: "el id no existe",
                },
            });
        }
        res.json({
            ok: true,
            mensaje: "Carritos eliminado",
        });
    });
});
//=====================================
//borrar carrito x producto
//=====================================

app.delete("/carritos/buscar/:id", (req, res) => {
    let id = req.params.id;
    Carrito.findOneAndRemove({
        'producto': id
    }, (err, carritoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!carritoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: "el id no existe",
                },
            });
        }
        res.json({
            ok: true,
            mensaje: "Carrito eliminado",
        });
    });
});

// =====================================
// Buscar un carrito x producto
// =====================================

app.get("/carritos/buscar/:termino/:id", (req, res) => {
    let termino = req.params.termino;
    let id = req.params.id;

    Carrito.find({
            'producto': termino,
            'usuario': id,
        }).populate({
            path: 'producto',
            populate: {
                path: 'subcategoria'
            }
        }).populate('usuario')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            res.json({
                ok: true,
                productos,
            });
        });
});
//=====================================
//Sumar carritos de un usuario
//=====================================

app.get("/carritos-suma/:id", (req, res) => {
    let id = req.params.id;
    
    Carrito.aggregate([{
            $match: {
                "usuario": {
                    "$in": [mongoose.Types.ObjectId(id)]
                }
            }
        },
        {
            $group: {
                _id: {},
                total: {
                    $sum: {
                        $multiply: ["$subtotal", 1]
                    }
                }
            }
        }
    ]).exec((err, total) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            total,
        });
    });

});
//=====================================
//Contar productos del carrito
//=====================================

app.get("/carritos-count/:id", (req, res) => {
    let id = req.params.id;
    console.log(res.json);
    Carrito.count({
        usuario: id
    }).exec((err, total) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        res.json({
            ok: true,
            total,
        });
    });

});

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