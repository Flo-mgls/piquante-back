// MODULES
const express = require("express");
const app = express();
const env = require("./environment");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const helmet = require("helmet");
const sanitizer = require("express-mongo-sanitize");
// FIN MODULES

// IMPORTATION ROUTES
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");
// FIN IMPORTATIONS

// CONNEXION BASE DE DONNEE
mongoose.connect(`mongodb+srv://${env.dbId}:${env.dbPW}@cluster0-1accl.mongodb.net/piquante?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
// FIN CONNEXION 

// HELMET
app.use(helmet()); // Protège l'app en paramétrant des Headers (notamment contre les failles XSS)
// FIN HELMET

// PARAMETRAGE DES HEADERS
app.use((req, res, next) => { // Evite les erreurs CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
// FIN PARAMETRAGE

// BODYPARSER
app.use(bodyParser.json()); // Rend le corps de la requête exploitable facilement
// FIN BODYPARSER

app.use(sanitizer());

// ROUTES
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);
// FIN ROUTES

module.exports = app;