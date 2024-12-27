const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import thư viện cors
const app = express();

async function main() {
  await mongoose.connect('mongodb+srv://PcHuy:1hHnRQtOIxxA6sTZ@cluster0.idi4juk.mongodb.net/devop_mongoosee?retryWrites=true&w=majority&appName=Cluster0');
  console.log("Connected to MongoDBBBB");
}
///test
var productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

// Sử dụng middleware CORS
app.use(cors({ 
  origin: 'http://localhost:3000',
  methods: ["GET", "POST", "PUT", "DELETE"] }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/product", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error when get list product", error });
  }
});

app.post("/product", async (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: "Name and price are required!" });
  }

  try {
    const product = new Product({ name, price });
    await product.save();
    res.status(201).json({ message: "Product created!", product });
  } catch (error) {
    res.status(500).json({ message: "Error when create product!", error });
  }
});

main().then(() => {
  app.listen(3001, () => {
    console.log("Server is running on port 3001");
  });
});
