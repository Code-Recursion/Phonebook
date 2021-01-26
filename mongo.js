const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Please provide password as an command line argument : node mongo.js password");
  process.exit(1);
}

const password = process.argv[2];
const PersonName = process.argv[3];
const PersonNumber = process.argv[4];

const url = `mongodb+srv://fullstackphonebook:${password}@cluster0.kza6r.mongodb.net/contacts?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const contactSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Contact = mongoose.model("Contact", contactSchema);

const contact = new Contact({
  name: PersonName,
  number: PersonNumber,
});

if (process.argv.length === 3) {
  Contact.find({}).then((contact) => {
    contact.forEach((person) => {
      console.log(person.name, person.number);
      console.log("\n-------------\n");
    });
    mongoose.connection.close();
  });
} else {
  contact.save().then((result) => {
    console.log(`added ${result.name}, with phone number ${result.number}`);
    mongoose.connection.close();
  });
}
