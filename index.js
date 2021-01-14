const express = require("express");
const app = express();
const morgan = require("morgan");

const cors = require("cors");
app.use(cors());

app.use(express.static('build'));

//json-parser
app.use(express.json());

// middleware logger
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.use(requestLogger);

let persons = [
  {
    id: 1,
    name: "Artop hellas",
    number: "3456784657",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "784657345",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "3456678934",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const totalContacts = persons.length;
  const currentDate = new Date();
  response.write(`Phonebok has info for ${totalContacts} people(s)\n`);
  response.write(`this request is made on ${currentDate.toString()}`);
  response.end();
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) response.json(person).status(200).end();
  else response.status(404).end();
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id != id);
  response.status(204).end();
});

const newId = () => {
  let maxId = Math.max(...persons.map((person) => person.id));
  return maxId + 1;
};

app.post("/api/persons", (request, response) => {
  // implement error handling for creating new entries.
  // req is not allowed to succeed if :
  // 1 the name or num is missing
  // 2 the name already exists in the phonebook

  const body = request.body;
  // console.log("body", body);
  if (!body.name) {
    return response.status(400).json({
      error: "contact name is missing",
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: "contact number is missing",
    });
  }

  const exists = persons.filter((person) => person.name.toLowerCase() === body.name.toLowerCase());

  if (exists.length) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }
  const person = {
    id: newId(),
    name: body.name,
    number: body.number,
  };
  persons = persons.concat(person);
  response.json(person);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`App is running on port 3001 at http://localhost:${PORT}`);
});
