// MODULES
const bcrypt = require("bcrypt"); // Hack le mot de passe
const jwt = require("jsonwebtoken"); // Génère un token sécurisé
// FIN MODULES

// IMPORTATION MODELS
const User = require("../models/User");
// FIN IMPORTATION

// MIDDLEWARE SIGNUP
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // Hash le mot de passe + salage
    .then(hash => {
        const user = new User({
            email: req.body.email.toLowerCase(), // On s'assure de rendre l'email non sensible à la casse
            password: hash
        });
        user.save() // On save l'user dans la base de donnée
        .then(() => res.status(201).json({ message: "Utilisateur crée !"}))
        .catch((e) => res.status(400).json(e));
    })
    .catch((e) => res.status(500).json(e));
};
// FIN MIDDLEWARE

// MIDDLEWARE LOGIN
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email.toLowerCase()}) // On recherche l'user selon son email
    .then(user => {
        if(!user){
           return res.status(401).json({error: "Utilisateur non trouvé !"});
        }
        bcrypt.compare(req.body.password, user.password) // On compare les deux hachage de mots de passe
        .then(valid => {
            if(!valid){
            return res.status(401).json({error: "Mot de passe incorrect !"});
            }
            res.status(200).json({ // On renvoi l'userId + le token sécurisé expirant dans 24h
            userId: user._id,
            token: jwt.sign(
                {userId: user._id},
                "TOKEN_SECRET",
                {expiresIn: "24h"}
            )
            });
        })
        .catch(e => res.status(500).json(e));
    })
    .catch(e => res.status(500).json(e));
};
// FIN MIDDLEWARE