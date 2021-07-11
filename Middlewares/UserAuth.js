const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('./../models/User');

require('dotenv').config();

const UserAuth = async(req, res, next) => {
    try{
        const Authtoken = req.header('Authorization').replace('Bearer', '').trim();
        console.log(Authtoken);
        const decoded = jwt.verify(Authtoken, process.env.ACCESS_TOKEN_SECRET);
        console.log(decoded);
        const user = await User.findOne({_id: decoded.id});
        //console.log(user);
        req.user = user;
        req.token = Authtoken;
        next();
    }catch (error) {
        res.status(401).send({ error: error.message });
    }
}

module.exports = UserAuth;