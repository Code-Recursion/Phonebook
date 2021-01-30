const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())

app.use(express.static('build'))

//json-parser
app.use(express.json())

const mongoose = require('mongoose')

require('dotenv').config()
const Contact = require('./Models/contact')

// middleware for logging between req and res
const requestLogger = (request, response, next) => {
  console.log('Method', request.method)
  console.log('Path', request.path)
  console.log('Body', request.body)
  console.log('--------------')
  next()
}

app.use(requestLogger)

app.get('/api/persons', (request, response) => {
  Contact.find({}).then((contacts) => {
    response.json(contacts.map((person) => person.toJSON()))
    // response.json(contacts);
  })
})

app.get('/info', (request, response) => {
  const requestMade = new Date().toString()

  Contact.countDocuments({}, (err, count) => {
    if (err) console.log(err)
    else {
      console.log('number of contacts', count)
      response.write(`Phonebok has info for ${count} people(s)\n`)
      response.write(`this request was made on ${requestMade}`)
      response.end()
    }
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Contact.findById(request.params.id)
    .then((result) => {
      if (result) {
        response.json(result.toJSON()).end()
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({
      error: 'contact name is missing',
    })
  }

  if (body.number === undefined) {
    return response.status(400).json({
      error: 'contact number is missing',
    })
  }

  const contact = new Contact({
    name: body.name,
    number: body.number,
  })

  contact
    .save()
    .then((result) => result.toJSON())
    .then((savedContactWithJsonFormatted) => {
      response.json(savedContactWithJsonFormatted)
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const updatedContact = {
    name: body.name,
    number: body.number,
  }

  // unable to get the data inside request this is the issue

  console.log(updatedContact)
  console.log('request ', request.params)

  Contact.findByIdAndUpdate(request.params.id, updatedContact, { new: true })
    .then((result) => {
      response.json(result)
    })
    .catch((error) => next(error))
})

const unkownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unkownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`App is running on port 3001 at http://localhost:${PORT}`)
})
