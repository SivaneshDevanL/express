const mongoose = require('mongoose');
const port = 3001
const app = require('./app');
mongoose.connect('mongodb+srv://sivanesh_DB1:dbsivapass@cluster0.n4x33mn.mongodb.net/notesapp', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    // useFindAndModify: false 
});

mongoose.connection
.once('open', () => {
    console.log('connection established')
})
.on('connectionError', (err) => {
    console.log(err);
})

app.listen(port);