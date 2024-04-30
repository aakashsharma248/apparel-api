
Steps to run the server:

1. Download the code from GitHub.
2. Navigate to the repository in the terminal and execute npm install.
3. Launch the Node.js app by running "node server.js".

Please reach out to me for any queries.


How to test the API:

--> You can test the APIs using tools like Postman or curl. Here are some example requests:

1. Update stock and price for one apparel code and size:

 PUT http://localhost:3000/apparel/DEF/M
{
  "quantity": 10,
  "price": 20
}

2. Update stock and price for multiple apparel codes and sizes:

 PUT http://localhost:3000/apparel/batch
[
  {
    "code": "ABC",
    "size": "S",
    "quantity": 10,
    "price": 20
  },
  {
    "code": "DEF",
    "size": "M",
    "quantity": 5,
    "price": 30
  }
]

3. Check if an order can be fulfilled:

POST http://localhost:3000/order/fulfill
{
  "items": [
    { "code": "ABC", "size": "S" },
    { "code": "DEF", "size": "M" }
  ]
}


4. Get the lowest cost to fulfill an order:

POST http://localhost:3000/order/lowest-cost
{
  "items": [
    { "code": "ABC", "size": "S" },
    { "code": "DEF", "size": "M" }
  ]
}
