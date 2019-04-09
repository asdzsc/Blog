const mongoose = require('mongoose')

//1.定义Schema
const UseSchema = new mongoose.Schema({
      username:{
        type:String
      },
      password:{
        type:String
      },
      isAdmin:{
        type:Boolean,
        default:false
      }
});

const UseRModel = mongoose.model('user', UseSchema);
//3.导出
module.exports = UseRModel 