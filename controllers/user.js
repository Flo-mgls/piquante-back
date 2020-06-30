const bcrypt = require("bcrypt");

const User = require("../models/User");

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({ message: "Utilisateur crée !"}))
        .catch((e) => res.status(400).json({e}));
    })
    .catch((e) => res.status(500).json({e}));
};

exports.login = (req, res, next) => {
    
};