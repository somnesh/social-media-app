const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ## Attributes:
// name
// date_of_birth
// username
// phone_no
// email
// password
// profile_picture_url
// profile_bio

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      minlength: 3,
      maxlength: 50,
    },
    date_of_birth: {
      type: Date,
      required: [true, "Please provide date of birth"],
    },
    username: {
      type: String,
      required: [true, "please provide an username"],
      unique: true,
      minlength: 3,
      maxlength: 12,
    },
    phone_no: {
      type: Number,
      required: [true, "please provide a phone number"],
      unique: true,
      match: [
        /(\+\d{1,3}\s?)?((\(\d{3}\)\s?)|(\d{3})(\s|-?))(\d{3}(\s|-?))(\d{4})(\s?(([E|e]xt[:|.|]?)|x|X)(\s?\d+))?/,
        "Please provide a valid phone number",
      ],
      minlength: 10,
      maxlength: 10,
    },
    email: {
      type: String,
      required: [true, "Please provide a email"],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        ,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "please provide a password"],
      minlength: 6,
    },
    profile_picture_url: {
      type: String,
    },
    profile_bio: {
      type: String,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  //   return jwt.sign(
  //     { userId: this._id, name: this.name },
  //     process.env.JWT_SECRET,
  //     { expiresIn: process.env.JWT_LIFESPAN }
  //   );
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
