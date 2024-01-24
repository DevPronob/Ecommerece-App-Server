// pronobroy3601
// E3X2rvPljIm2V7yF
const mongoose = require('mongoose')
const dotenv =require('dotenv')
dotenv.config()
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`mongodb+srv://pronobroy3601:9GQArOdHLGWdbgMa@cluster0.qoxurhs.mongodb.net/?retryWrites=true&w=majority`)

    console.log(`MongoDB Connected: `)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

module.exports = connectDB