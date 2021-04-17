import mongoose from 'mongoose';
import { Password } from '../utils/password';

// This interface describe the properties needed to create a User
interface UserAttrs {
    email: string;
    password: string;
}

//This interface will describe the properties that a User model has
interface UserModel extends mongoose.Model<any> {
    build(attrs: UserAttrs): UserDoc;
}

// This interface describes the properties that a User Document has
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    next();
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };