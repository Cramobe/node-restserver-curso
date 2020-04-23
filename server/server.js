require('./config/config')

const express = require('express');
const mongoose = require('mongoose');
const path = require('path')


const app = express();


const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use( require('./routes/index')); //Configuracion de rutas

// Habilitar la carpeta public

app.use( express.static(path.resolve( __dirname , '../public')))


mongoose.connect(process.env.URLDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
},(err,res)=>{
    if(err) throw err;
    console.log('Base de datos conectada');
});
// .then(()=> console.log('base de datos ONLINE'))
// .catch(err => console.log('No se pudo conectar', err));

app.listen(process.env.PORT, () => {
    console.log(`Escuchando en el puerto ${process.env.PORT}`);
})