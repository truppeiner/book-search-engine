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
        },
        // save a book 
        saveBook: async (parent, { book }, context) => {
            // { book } deconstructs book object
            // checks to see if user logged in before anything else
            if (context.user){
                const pushBook = await User.findOneAndUpdate(
                    // pulls users id from me
                    { _id: context.user._id },
                    // pushes saved book into savedBook array 
                    { $push: {savedBooks: book }},
                    // updates savedBooks array and validates
                    { new: true, runValidators: true }
                );
                // runs addBook
                return pushBook;
            }
            // kicks error if not logged in 
            throw new AuthenticationError('No user logged in!');
        },
        // remove a book 
        removeBook: async( parent, { bookId }, context) => {
            // checks to see if user signed in
            if (context.user){
                const deleteBook = await User.findOneAndUpdate(
                    // pulls current user id
                    { _id: context.user._id },
                    // pulls out book from saved book array by book id
                    { $pull: {savedBooks: {bookId}}},
                    // updates new savedBooks state
                    { new: true }
                );
                // runs deletebook method
                return deleteBook;
            }
            // kicks error if not logged in
            throw new AuthenticationError('No user logged in!')
        }
    }
};

module.exports = resolvers;