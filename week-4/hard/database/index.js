const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://220714100078:220714100078@cluster0.yz5kj.mongodb.net/');

// Define schemas
const UserSchema = new mongoose.Schema({
    // Schema definition here
    username : {
        type : String, 
        required : true,
        unique : true,
    },
    email : {
        type : String,
        unique : true,
        validate : {
            validator : function(v){
                return /.+\@.+\..+/.test(v);
            },
            message : props => `${props.value} is not a valid email address`
        }
    },
    password : {
        type : String, 
        required : true,
        minlength : 8,
        maxlength : 255,
    }
},{timestamps:true});

const TodoSchema = new mongoose.Schema({
    // Schema definition here
    title : {
        type : String,
        required : true
    },
    description : {
        type : String
    },
    completed : {
        type : Boolean,
        default : false
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true
    }
},{timestamps: true});

const User = mongoose.model('User', UserSchema);
const Todo = mongoose.model('Todo', TodoSchema);

module.exports = {
    User,
    Todo
}