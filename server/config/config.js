
//======================
// Puerto
// =====================

process.env.PORT = process.env.PORT || 3000;



// ============================
// Entorno
// ============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================
// Vencimiento del token
// ============================ 
// 60 seg 
// 60 min
// 24hr
// 30 dias


process.env.CADUCIDAD_TOKEN =  60 * 60 * 24 * 30;

// ============================
// SEED del token
// ============================

process.env.SEED = process.env.SEED || 'seed de desarrollo';

// ============================
// Base de datos
// ============================
let urlDB;

if( process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
} else{
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// ============================
// Google Client ID
// ============================

process.env.CLIENT_ID = process.env.CLIENT_ID || '631347894701-jrjm35mlpqrnv6b7hb5vvgh6d7nascb3.apps.googleusercontent.com';

