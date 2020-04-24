
const express = require('express');

let { verificaToken, verificaAdminRole} = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

//=============================
// Mostrar todas las categorias
//=============================

app.get('/categoria', verificaToken,(req,res) =>{

    Categoria.find({})
                .sort('descripcion')
                .populate('usuario','nombre email')
                .exec( (err, categoriasDB) =>{
                    if(err){
                        return res.status(400).json({
                            ok: false,
                            err
                        })
                    };

                    Categoria.countDocuments( (err, cantidad) =>{
                        if(err){
                            return res.status(400).json({
                                ok: false,
                                err
                            })
                        };
                        res.json({
                            ok: true,
                            categoriasDB,
                            cantidad
                        });
                    });

                });

});


//=============================
// Mostrar una categoria por id
//=============================

app.get('/categoria/:id', verificaToken,(req,res) =>{

    let id = req.params.id

    Categoria.findById( id, ( err, categoriaDB) =>{
        if(err){
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No se pudo encontrar la categoria"
                }
            })
        };

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No se pudo encontrar la categoria"
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })

});


//=============================
// Crear una nueva categoria
//=============================

app.post('/categoria/',verificaToken,(req,res) =>{

    let id_usuario = req.usuario._id;

    let body = req.body

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: id_usuario
    });

    categoria.save( (err, categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        };

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })


});


//=============================
// Editar una categoria
//=============================

app.put('/categoria/:id',verificaToken,(req,res) =>{

    let id = req.params.id
    let descripcion = req.body.descripcion

    Categoria.findByIdAndUpdate( id,{descripcion: descripcion},{ new:true, runValidators:true},(err, categoriaDB) =>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        };

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    } )

});


//=============================
// Eliminar una categoria
//=============================

app.delete('/categoria/:id',[verificaToken,verificaAdminRole],(req,res) =>{

    let id = req.params.id;

    Categoria.findByIdAndRemove( id, (err, categoriaBorrada) =>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        };

        if(!categoriaBorrada){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada
        })
    })

});

module.exports = app;

