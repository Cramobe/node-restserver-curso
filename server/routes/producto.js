

const express = require('express');


const { verificaToken } =require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');
let Categoria = require('../models/categoria');




//=====================
// Obtener productos
//======================

app.get('/productos',verificaToken, (req, res) =>{

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let hasta = req.query.hasta || 5;
    hasta = Number(hasta);
    Producto.find({})
            .populate('usuario','nombre email')
            .populate('categoria','descripcion')
            .limit(hasta)
            .skip(desde)
            .exec((err, productosDB) =>{
                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                };

                Producto.countDocuments( (err, cantidad) =>{
                    if(err){
                        return res.status(400).json({
                            ok: false,
                            err
                        })
                    };
                    res.json({
                        ok: true,
                        productosDB,
                        cantidad
                    });
                });

            })
    
});

//=========================
// Obtener productos por ID
//=========================

app.get('/productos/:id', verificaToken,(req, res) =>{
    
    let id = req.params.id

    Producto.find({_id: id})
        .populate('usuario','nombre email')
        .populate('categoria','descripcion')
        .exec( (err, productoDB) =>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            };

            if(!productoDB){
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "No se pudo encontrar el producto"
                    }
                })
            }

            res.json({
                ok: true,
                usuario: productoDB
            });
        })
});

//=========================
// Buscar Producto
//=========================

app.get('/productos/buscar/:termino', verificaToken,(req, res) =>{
    
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({nombre: regex})
        .populate('categoria','descripcion')
        .exec( (err, productoDB) =>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            };

            if(!productoDB){
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "No se pudo encontrar el producto"
                    }
                })
            }

            res.json({
                ok: true,
                usuario: productoDB
            });
        })
});


//=========================
// Crear un nuevo producto
//=========================

app.post('/productos', verificaToken,(req, res) =>{
    
    let boddy = req.body;

    let producto = new Producto({        
        nombre: boddy.nombre,
        precioUni: boddy.precioUni,
        descripcion: boddy.descripcion,
        disponible: boddy.disponible,
        categoria: boddy.categoria,
        usuario: req.usuario._id,
    });

    Categoria.findById(producto.categoria, (err, categoriaDB) =>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        };
        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err:{
                    message: "Categoria no valida"
                }
            })
        }

        producto.save( (err, productoDB) =>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            };
    
            if(!productoDB){
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
    
            res.json({
                ok: true,
                usuario: productoDB
            });
        })
    })

});


//=========================
// Actualizar un producto
//=========================

app.put('/productos/:id',verificaToken, (req, res) =>{

    let body = req.body

    let id = req.params.id

    Producto.findByIdAndUpdate(id, body,{ new:true, runValidators:true},(err, productoDB) =>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        };

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No se pudo encontrar el producto"
                }
            })
        }

        res.json({
            ok: true,
            usuario: productoDB
        });
    })
    
});


//=========================
// Borrar un producto
//=========================

app.delete('/productos/:id', (req, res) =>{
    let id = req.params.id

    Producto.findByIdAndUpdate(id,{disponible:false},{new:true},( err, productoDB) =>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        };

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No se pudo encontrar el producto"
                }
            })
        }

        res.json({
            ok: true,
            message: "Producto borrado"
        });
    })
});



module.exports = app;