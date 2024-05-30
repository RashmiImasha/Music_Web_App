const router = require("express").Router();
let User = require("../models/User");

// create a new user
router.route("/addUser").post(async (req, res) => {

    const userName = req.body.userName;
    const password = req.body.password;
    const role = req.body.role;

    try {
        const systemuser = await User.findOne({ userName, password, role });

        if (systemuser) {
            res.json("exist");
        }

        const newUser = new User({
            userName,
            password,
            role
        });


        await newUser.save();
        console.log('User created successfully');
        res.json("notExist");
    }
    catch (e) {
        res.json("fail")
    }
})


// login user
router.route("/get/login").post(async (req, res) => {

    let userName = req.body.userName;
    let password = req.body.password;
    let role = req.body.role;

    try {
        const systemUser = await User.findOne({ userName, password, role });

        if (systemUser) {
            res.json("exist")
        }
        else {
            res.json("notExist")
        }
    }
    catch (e) {
        res.json("fail")
    }

})

module.exports = router;