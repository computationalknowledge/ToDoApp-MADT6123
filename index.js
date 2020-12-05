const express = require('express')
const mongoose = require('mongoose')
const app = express()

mongoose.set('useFindAndModify', false)

app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs')

mongoose.connect('mongodb://localhost:27017/todolistDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const todoTaskSchema = {
  name: String,
}

const Item = mongoose.model('Item', todoTaskSchema)

// Read
app.get('/', (req, res) => {
  Item.find({}, (err, tasks) => {
    res.render('todo.ejs', { todoTasks: tasks })
  })
})

// Create
app.post('/', function (req, res) {
  const item = new Item({
    name: req.body.name,
  })

  item.save()
  res.redirect('/')
})

// Update

app
  .route('/edit/:id')
  .get((req, res) => {
    const id = req.params.id
    Item.find({}, (err, tasks) => {
      res.render('todoEdit.ejs', { todoTasks: tasks, idTask: id })
    })
  })
  .post((req, res) => {
    const id = req.params.id
    Item.findByIdAndUpdate(id, { name: req.body.name }, (err) => {
      if (err) return res.send(500, err)
      res.redirect('/')
    })
  })

// Delete

app.route('/remove/:id').get((req, res) => {
  const id = req.params.id
  Item.findByIdAndRemove(id, (err) => {
    if (err) return res.send(500, err)
    res.redirect('/')
  })
})

app.listen(3000, () => {
  console.log('Server Up and running')
})
