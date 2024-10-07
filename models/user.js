const mongoose = require("mongoose");
const bycrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: Number, 
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  tokens: [
    {
      type: Object,
    },
  ],
  isowner: {
    type: Boolean,
    default: false,
  },
});

//middle ware for hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bycrypt.genSalt(10);
    this.password = await bycrypt.hash(this.password, salt);
    return next();
  } catch (e) {
    return next(e);
  }
});

//is first time user

userSchema.statics.isThisEmailInUse = async function (username) {
  try {
    const user = await this.findOne({ username: username });
    return !!user;
  } catch (e) {
    console.log("error in email in use method", e);
    return false;
  }
};

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bycrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
