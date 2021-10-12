const express = require("express");

var ObjectId = require('mongodb').ObjectID;
const cors = require('cors');
let app = express();
app.use(cors({ origin: '*' }));

let Producto = require("../models/producto");

//=====================================
//mostrar todas las categorias
//=====================================

app.get("/productos", (req, res) => {
    //traer todos los productos

    // let desde = req.query.desde || 0;
    // desde = Number(desde);
// .skip(desde)
        // .limit(10)
    Producto.find()
        .populate('subcategoria')
        .populate({
            path: 'subcategoria',
            populate: {
                path: 'categoria'
            }
        })
        .populate('proveedor', 'razonSoc')
        .exec((err, productos) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err,
                });
            }

            Producto.count().exec((err, conteo) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err,
                    });
                }
                res.json({
                    ok: true,
                    conteo,
                    productos
                });
            });
            // res.json({
            //     ok: true,
            //     productos,
            // });
        });
});

app.get("/productos-subcategoria/:id", (req, res) => {
    //traer todos los productos
    let id = req.params.id;

    Producto.find({
            subcategoria: id
        })
        .populate('subcategoria')
        .populate({
            path: 'subcategoria',
            populate: {
                path: 'categoria'
            }
        })
        .populate('proveedor', 'razonSoc')
        .exec((err, productos) => {
            if (err) {
                res.status(500).json({
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
//obtener un producto por id
//=====================================

app.get("/productos/:id", (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate('subcategoria')
        .populate({
            path: 'subcategoria',
            populate: {
                path: 'categoria'
            }
        })
        .populate('proveedor', 'razonSoc')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        mensaje: "el id no existe",
                    },
                });
            }
            res.json({
                ok: true,
                producto: productoDB,
            });
        });
});

//=====================================
//crear un nuevo producto
//=====================================

app.post("/productos", (req, res) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        unidadMedida: body.unidadMedida,
        img: body.img,
        subcategoria: body.subcategoria,
        proveedor: body.proveedor,
        stock: body.stock
    });

    producto.save((err, productoBD) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err,
            });
        }
        res.status(201).json({
            ok: true,
            producto: productoBD,
        });
    });
});

//=====================================
//actualizar producto
//=====================================

app.put("/productos/:id", (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Producto.findByIdAndUpdate(
        id, {
            new: true,
            runValidators: true,
        },
        (err, productoBD) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (!productoBD) {
                res.status(400).json({
                    ok: false,
                    err: {
                        mensaje: "no existe el producto con este id en la base de datos",
                    },
                });
            }
            productoBD.nombre = body.nombre;
            productoBD.precioUni = body.precioUni;
            productoBD.descripcion = body.descripcion;
            productoBD.unidadMedida = body.unidadMedida;
            productoBD.stock = body.stock;
            (productoBD.img = body.img),
            (productoBD.subcategoria = body.subcategoria),
            (productoBD.proveedor = body.proveedor),
            productoBD.save((err, productoGuardado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err,
                    });
                }
                res.json({
                    ok: true,
                    producto: productoGuardado,
                });
            });
        }
    );
    //grabar el usuario
    //grabar una categoria del listado
});

//=====================================
//borrar producto
//=====================================

app.delete("/productos/:id", (req, res) => {
    let id = req.params.id;
    Producto.findByIdAndRemove(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: "el id no existe",
                },
            });
        }
        res.json({
            ok: true,
            mensaje: "Producto eliminado",
        });
    });
});

//=====================================
//Filtrar un producto
//=====================================

app.get("/productos/buscar/:termino", (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, "i");

    // let desde = req.query.desde || 0;
    // desde = Number(desde);

        // .skip(desde)
        // .limit(10)
    Producto.find({
            nombre: regex,
        })
        .sort("nombre")
        .populate('subcategoria')
        .populate({
            path: 'subcategoria',
            populate: {
                path: 'categoria'
            }
        })
        .populate('proveedor', 'razonSoc')
        .exec((err, productos) => {
            if (err) {
                res.status(500).json({
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

module.exports = app;