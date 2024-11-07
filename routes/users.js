const User = require('../models/User')
const router = require('express').Router()
const bcrypt = require('bcrypt')


//Update User
router.put('/:id', async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {

    //checking if the password field is present in the request body (req.body)
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err)
      }
    };

    //updating actual user, and it's gonna automatically set all inputs inside the req.body
    try {
      const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body, })
      res.status(200).json({ message: "User has been successfully updated!", user });
    } catch (err) {
      return res.status(500).json(err)
    };

  } else {
    return res.status(403).json('You can only update your account!')
  }
});


//Delete User
router.delete('/:id', async (req, res) => {

  // Checking if the user is authorized to delete the account
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id)
      res.status(200).json({ message: "User has been successfully deleted!", user });
    } catch (err) {
      return res.status(500).json(err)
    }

  } else {
    return res.status(403).json('You can only delete your account!')
  }
});


//Get a User
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatesAt, ...other } = user._doc;
    res.status(200).json(other)
  } catch (err) {
    return res.status(500).json(err)
  }
});


//Follow a User
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you already follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});


//Unfollow a User
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you already unfollow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
});



module.exports = router