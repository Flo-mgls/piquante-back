const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email.toLowerCase(),
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({ message: "Utilisateur crée !"}))
        .catch((e) => res.status(400).json({e}));
    })
    .catch((e) => res.status(500).json({e}));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email.toLowerCase()})
    .then(user => {
        if(!user){
           return res.status(401).json({error: "Utilisateur non trouvé !"});
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if(!valid){
            return res.status(401).json({error: "Mot de passe incorrect !"});
            }
            res.status(200).json({
            userId: user._id,
            token: jwt.sign(
                {userId: user._id},
                "TOKEN_SECRET",
                {expiresIn: "24h"}
            )
            });
        })
        .catch(e => res.status(500).json({e}));
    })
    .catch(e => res.status(500).json({e}));
};