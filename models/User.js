import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);

// Helper functions
export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const findUserById = async (id) => {
  return await User.findById(id).select("-password");
};

export const getAllUsersFromDB = async () => {
  return await User.find().select("-password").sort({ createdAt: -1 });
};

export const createUserInDB = async (name, email, password) => {
  const user = await User.create({ name, email, password });
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

export const updateUserInDB = async (id, name, email) => {
  const updateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;

  return await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
};

export const deleteUserInDB = async (id) => {
  return await User.findByIdAndDelete(id);
};

export default User;