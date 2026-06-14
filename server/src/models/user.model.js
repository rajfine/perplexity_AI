

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  verified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return
  }

  // Avoid re-hashing already-hashed passwords during maintenance saves.
  if (typeof this.password === 'string' && this.password.startsWith('$2')) {
    return
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
  } catch (err) {
    next(err);
  }
});

const userModel = mongoose.model('User', userSchema);
export default userModel;
