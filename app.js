const { notStrictEqual } = require("assert")
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const notes = require("./schema")
const cors = require("cors")
app.use(cors())
app.use(express.json())
app.use(express.urlencoded())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false })) //try true also 
app.get('/data', (req, res) => {
    let n = []
    notes.find({})
        .then((note) => {
            note.map(i => i._doc.admin == undefined && n.push(i))
            res.status(200).json({ n })
        }
        )
})
app.post('/admin', (req, res) => {
    const { name, password } = req.body;
    let noadmin = true;
    notes.find({ admin: true })
        .then((y =>
            y[0]._doc.list.map((i) => {
                if (i.name === name && i.password === password) {
                    res.status(200).json({ message: "success" });
                    noadmin = false;
                }
            })
        ))
    setTimeout(() =>
        noadmin && res.status(200).json({ message: "failed" }), 500)
})
app.delete('/deleteAdmin', (req, res) => {
    const { _id } = req.body;
    notes.findByIdAndRemove(_id)
        .then(y => y && res.status(200).json({ message: "success" }))
})
function get(name,pass) {
    app.get('/', (req, res) => {
        // notes.find({userName:name,password:pass})
        notes.find({})
            .then((item) => {
                item.filter((note) => {
                    if (note._doc.userName === name && note._doc.password === pass) {
                        res.status(200).json({ note })
                        return note
                    }
                })
            })
    })
}
app.post('/login', (req, res) => {
    const { userName, password } = req.body
    let v;
    notes.find({})
        .then(y =>
            v = y.filter((i) => {
                if (i._doc.userName === userName && i._doc.password === password) {
                    return i;
                }
            }
            ))
    setTimeout(() => {
        if (v !== undefined && v.length !== 0) {
            res.status(200).json({
                message: "success"
            })
        }
        else {
            res.status(200).json({
                message: "failed"
            })
        }
    }, 500)
    get(userName,password)
})
app.post('/signup', (req, res) => {
    const { userName, password } = req.body
    let v;
    // notes.find({userName,password})
    notes.find({})
        .then(y => v = y.filter(i => i._doc.userName === userName && i._doc.password === password))
    setTimeout(() => {
        console.log(v);
        if (v === undefined || v.length === 0) {
            notes.create(req.body);
            res.status(200).json({
                message: "created"
            })
        }
        else {
            res.status(200).json({
                message: "failed"
            })
        }
    }, 500)
})



app.post('/add', (req, res) => {
    const {userName,password, title, description, id } = req.body;
    if (id && (title || description)) {
        notes.find({ userName, password})
            .then(x => {
                const t = `title${id}`;
                const d = `description${id}`;
                // const product = Product.findByIdAndUpdate(req.params.id, req.body, {
                //     new: true,
                //   });

                // const product = await Product.findByIdAndRemove(req.params.id);
                notes.findOneAndUpdate({ userName, password }, { $set: { [t]: title, [d]: description } },
                    { upsert: true }
                    , function (err, doc) {
                        if (err) { throw err; }
                        else {
                            get(userName,password);
                            res.status(200).json({
                                message: 'success'
                            })
                        }
                    }
                )
            })
    }
    else if (id) {
        notes.find({ userName, password })
            .then(x => {
                const t = `title${id}`;
                const d = `description${id}`;
                notes.findOneAndUpdate({ userName, password }, { $set: { [t]: '', [d]: '' } },
                    { upsert: true }, function (err, doc) {
                        if (err) { throw err; }
                        else {
                            get(userName,password);
                            console.log("Updated");
                            res.status(200).json({
                                message: 'success'
                            })
                        }
                    }
                )
            })
    }
    else {
        notes.find({ userName, password })
            .then(x => {
                const i = (Object.keys(x[0]._doc).length / 2) - 1;
                const t = `title${i}`;
                const d = `description${i}`;
                notes.findOneAndUpdate({ userName, password }, { $set: { [t]: title, [d]: description } },
                    { upsert: true }, function (err, doc) {
                        if (err) { throw err; }
                        else {
                            get(userName,password);
                            res.status(200).json({
                                message: 'success'
                            })
                        }
                    }
                )
            })
    }
})



// app.delete('/delete',(req,res)=>{
//     const {id}=req.body
//     const t=`title${id}`;
//     const d=`description${id}`;
//     notes.findOneAndUpdate({userName:name,password:pass},{ $unset: { [t]: title,[d]:description } } ,  
//         {upsert: true},function(err,doc) {
//             if (err) { throw err; }
//             else {    get();
//                  console.log("Updated");
//                  res.status(200).json({
//                      message:'success'
//                  })
//                  }}
//         )
// })

module.exports = app;
