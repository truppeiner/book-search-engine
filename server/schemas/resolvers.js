const { AuthenticationError } = require('apollo-server-express');

const { Book, User } = require('../models');

const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // get all users 
        users: async () => {
            return User.find()
                .select('-__v -password')
                .populate('savedBooks');
        },
        // get logged in user 
        me: async (parent, args, context ) => {
            if (context.user){
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    .populate('savedBooks')
                    return userData;
            }
            throw new AuthenticationError('No user logged in!');
        },
    },
    Mutation: {
        // login 
        login: async (parent, { email, password }) =>{
            const user = await User.findOne({ email });
            if (!user){
                throw new AuthenticationError('Email or password is incorrect.');
            }
            const correctPassword = await user.isCorrectPassword(password);

            if (!correctPassword){
                throw new AuthenticationError('Email or password is incorrect.');
            }

            const token = signToken(user);
            return {token, user };
        },
        // create new user
        addUser: async ( parent, args ) => {
            const user = await User.create(args);
            const token = signToken(user)

            return { user, token };
        }
    }
};

module.exports = resolvers;