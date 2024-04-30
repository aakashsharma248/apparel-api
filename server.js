// app.ts

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs-extra');

const app = express();
const PORT = 3000;
const DATA_FILE = 'data.json';

app.use(bodyParser.json());

let data = {};

try {
  const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
  if (fileContent.trim() !== '') {
    data = JSON.parse(fileContent);
  }
} catch (error) {
  if (error.code !== 'ENOENT') { // Ignore error if file does not exist
    console.error('Error reading data file:', error);
  }
}

// Save data to JSON file
const saveData = async () => {
  try {
    await fs.writeJSON(DATA_FILE, data);
  } catch (error) {
    console.error('Error writing data file:', error);
  }
};

// Update stock and price for one apparel code and size
app.put('/apparel/:code/:size', (req, res) => {
  const { code, size } = req.params;
  const { quantity, price } = req.body;

  if (!data[code]) {
    data[code] = { code, sizes: {} };
  }

  data[code].sizes[size] = { quantity, price };

  saveData().then(() => {
    res.json({ message: 'Stock and price updated successfully' });
  });
});

// Update stock and price for multiple apparel codes and sizes
app.put('/apparel/batch', (req, res) => {
  const updates = req.body;

  updates.forEach(update => {
    const { code, size, quantity, price } = update;

    if (!data[code]) {
      data[code] = { code, sizes: {} };
    }

    data[code].sizes[size] = { quantity, price };
  });

  saveData().then(() => {
    res.json({ message: 'Batch updates completed successfully' });
  });
});

// Check if an order can be fulfilled
app.post('/order/fulfill', (req, res) => {
  const order = req.body;
  let canFulfill = true;

  order.items.forEach(item => {
    const { code, size } = item;
    if (!data[code] || !data[code].sizes[size] || data[code].sizes[size].quantity <= 0) {
      canFulfill = false;
    }
  });

  res.json({ canFulfill });
});


// Get the lowest cost to fulfill an order
app.post('/order/lowest-cost', (req, res) => {
  const order = req.body;
  let totalCost = 0;

  order.items.forEach(item => {
    const { code, size } = item;
    if (data[code] && data[code].sizes[size]) {
      totalCost += data[code].sizes[size].price;
    }
  });

  res.json({ lowestCost: totalCost });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
