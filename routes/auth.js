const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

//Register
router.post('/register', async (req, res) => {
    try {
        //generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            // password: req.body.password,
            password: hashedPassword,
        });

        //save user and respond
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        res.status.json(err)
    }
});

//Login
router.post('/login', async (req, res) => {

    try {
        const user = await User.findOne({ email: req.body.email });
        //!user: if there is no user like that:.......
        !user && res.status(404).json('user not found');

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        //if the password isn't valid, I'll send.....
        !validPassword && res.status(400).json("wrong password")


        //if the user enter the valid email and password, it's gonna send....
        res.status(200).json(user)

    } catch (err) {
        res.status(500).json(err)
    }

})



module.exports = router
