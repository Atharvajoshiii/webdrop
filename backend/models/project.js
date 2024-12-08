const mongoose = require('mongoose')

const ProjectSchema = mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    projectName:{
        type:String,
        required:true
    },
    hostedUrl:{
        type:String,
        required:true
    },
    uploadDate:{
        type:Date,
        default:Date.now()
    }

})

module.exports = mongoose.model('project',ProjectSchema)