const mongoose=require('mongoose');

const marioschema=new mongoose.Schema(
    { any: {} },
    { collection: "notes", strict: false }
)
const mariomodel=mongoose.model("notes",marioschema);

module.exports=mariomodel