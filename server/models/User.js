const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ## Attributes:
// name
// date_of_birth
// gender
// username
// phone_no
// email
// password
// avatar
// profile_bio
// role [admin, user]
// refreshToken
// isVerified
// verified
// timestamps

// collection schema
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      minlength: 3,
      maxlength: 50,
    },
    date_of_birth: {
      type: String,
      required: [true, "Please provide date of birth"],
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "please provide gender"],
    },
    username: {
      type: String,
      required: [true, "please provide an username"],
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
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
      trim: true,
      lowercase: true,
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
    avatar: {
      type: String,
      default: null,
    },
    avatarBg: {
      type: String,
      default: getRandomColor,
    },
    cover_photo: {
      type: String,
      default: null,
    },
    profile_bio: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    suspensionReason: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

UserSchema.index({
  name: "text",
  username: "text",
  email: "text",
});

const colors = [
  "bg-blue-500",
  "bg-yellow-500",
  "bg-indigo-500",
  "bg-orange-500",
];

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

// before inserting all data into the database, hashing the password for privacy and security
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (!this.avatarBg) {
    this.avatarBg = getRandomColor();
  }
  // const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// JWT token structure
// {
//    "userId": some id
//    "name": user's display name
//    "role": admin or user
// }

// creating a Json WebToken
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      userId: this._id,
      name: this.name,
      role: this.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: this.role === "admin" ? "1hr" : process.env.JWT_LIFESPAN }
  );
};

UserSchema.methods.createJWTRefresh = function () {
  return jwt.sign(
    {
      userId: this._id,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn:
        this.role === "admin" ? "1hr" : process.env.JWT_REFRESH_LIFESPAN,
    }
  );
};

// this function compares hashed password from the database with the user given password while login
UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
