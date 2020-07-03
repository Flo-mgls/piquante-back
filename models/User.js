// MODULES
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator"); // S'assure de ne pas avoir deux même adresses mail
// FIN MODULES

// USER SCHEMA
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true}
});
// FIN SCHEMA

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);