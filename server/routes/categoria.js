const express = require('express');
const cors = require('cors');

let Categoria = require('../models/categoria');

let app = express();
app.use(cors({ origin: '*' }));

//=====================================
//mostrar todas las categorias
//=====================================

app.get('/categoria', (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .exec((err, categoria) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categoria
            })
        })
});

//=====================================
//mostrar una categoria por id.
//=====================================

app.get('/categoria/:id', (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'el id no existe en la tabla categoria'
                }
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });
});

//=====================================
//crear nueva categoria
//=====================================

app.post('/categoria', (req, res) => {
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        img: body.img,
    });

    categoria.save((err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }


        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaBD
        });
    });
});

//=====================================
//actualizar nueva categoria
//=====================================

app.put('/categoria/:id', (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion,
        img: body.img,
    };

    Categoria.findByIdAndUpdate(id, descCategoria, {
        new: true,
        runValidators: true
    }, (err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        res.json({
            ok: true,
            categoria: categoriaBD
        });
    });

});

//=====================================
//eliminar nueva categoria
//=====================================

app.delete('/categoria/:id', (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el id no existe'
                }
            });
        };
        res.json({
            ok: true,
            mensaje: 'categoria borrada'
        });
    });
});

//=====================================
//Filtrar una categoria
//=====================================

app.get('/categoria/buscar/:termino', (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Categoria.find({
            descripcion: regex
        })
        .sort('descripcion')
        .exec((err, categoria) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categoria
            });
        });
});

module.exports = app;