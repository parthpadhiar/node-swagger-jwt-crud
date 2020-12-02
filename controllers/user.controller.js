const { update } = require('../models/user.model');
const User = require('../models/user.model');

exports.home = (req, res) => {
    res.status(200).send(`Welcome to login , sign-up api`);
}

exports.register = (req, res) => {
    const newUser = new User(req.body)
    if (newUser.password != newUser.password2) {
        return res.status(400).json({
            message: "password not match"
        });
    }
    User.findOne({
        email: newUser.email
    }, (err, user) => {
        if (user) {
            return res.status(400).json({
                auth: false,
                message: "email exits"
            });
        }
        newUser.name;
        newUser.gender;
        newUser.phone;
        newUser.userName;
        newUser.save((err, doc) => {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    success: false
                });
            }
            console.log('User created Successfully');
            res.status(200).json({
                succes: true,
                user: doc
            });
        });
    });
}

exports.login = (req, res) => {
    let token = req.cookies.auth
    User.findByToken(token, (err, user) => {
        if (err) {
            return res(err);
        }
        if (user) {
            return res.status(400).json({
                error: true,
                message: "You are already logged in"
            });
        } else {
            User.findOne({
                'email': req.body.email
            }, function (err, user) {
                if (!user) {
                    return res.json({
                        isAuth: false,
                        message: ' Auth failed ,email not found'
                    });
                }
                user.comparepassword(req.body.password, (err, isMatch) => {
                    if (!isMatch) {
                        return res.json({
                            isAuth: false,
                            message: "password doesn't match"
                        });
                    }
                    user.generateToken((err, user) => {
                        if (err) {
                            return res.status(400).send(err);
                        }
                        res.cookie('auth', user.token).json({
                            isAuth: true,
                            id: user._id,
                            email: user.email
                        });
                    });
                });
            });
        }
    });
}

exports.profile = (req, res) => {
  
}

exports.logout = (req, res) => {
    req.user.deleteToken(req.token, (err, user) => {
        if (err) {
            return res.status(400).send(err);
        }
        res.sendStatus(200);
    });
}

exports.editProfile = (req, res) => {
     User.findByIdAndUpdate({_id: req.user._id}, {
        "$set":{
            "name": req.body.name,
            "userName": req.body.userName,
            "phone": req.body.phone,
            "gender": req.body.gender
        }
    }, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Updated");
            return res.send("updated")
        }
    })
}

exports.deleteUser = (req, res) => {
    console.log(req.user._id);
    User.deleteOne({ _id: req.user._id}, (err) => {
        if (err) {
            log.info(err)
            console.log(err);
        } else {
            console.log('deleted');
            res.send("DELETED")
        }
    })
}