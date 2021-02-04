// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config()
// }
require('dotenv').config()

// eslint-disable-next-line no-undef
let MONGODB_URI = process.env.MONGODB_URI
// eslint-disable-next-line no-undef
let PORT = process.env.PORT

module.exports = {
  MONGODB_URI,
  PORT,
}
