const contactRouter = require('express').Router()
const Contact = require('../models/contact')

contactRouter.get('/', (request, response) => {
  Contact.find({}).then((contacts) => {
    response.json(contacts.map((person) => person.toJSON()))
    // response.json(contacts)
  })
})

contactRouter.get('/info', (request, response) => {
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

contactRouter.get('/:id', (request, response, next) => {
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

contactRouter.delete('/:id', (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

contactRouter.post('/', (request, response, next) => {
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

contactRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const updatedContact = {
    name: body.name,
    number: body.number,
  }

  console.log(updatedContact)
  console.log('request ', request.params)

  Contact.findByIdAndUpdate(request.params.id, updatedContact, { new: true })
    .then((result) => {
      response.json(result)
    })
    .catch((error) => next(error))
})

module.exports = contactRouter
