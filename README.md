# Stock Price Checker API

A TypeScript-based Express.js API for tracking stock prices and calculating moving averages using a stock market API (e.g., Finnhub). The application also starts periodic checks for stock price updates and saves them to a database.

## Features

- **Track Stock Prices**: Fetch real-time stock prices and calculate moving averages.
- **Cron Job**: Periodic price checks every minute for a specified stock symbol.
- **Error Handling**: Comprehensive error handling with custom exceptions.
- **Logging**: Integrated logging with different log levels for development and production environments.
- **API Documentation**: OpenAPI documentation generation for endpoints.


## Tech Stack

- **Node.js** (v20.17.0 or later)
- **TypeScript** (v5.6.3 or later)
- **Express.js**
- **Prisma ORM**
- **PostgreSQL** (or any other relational database)
- **Cron Jobs** with `node-cron`
- **Logging** with `Winston`
- **OpenAPI** for API documentation

## Directory Structure

```plaintext
.
├── docs
│   └── openapi.json                # OpenAPI spec for the API
├── prisma
│   ├── migrations                  # Prisma migration files
│   ├── schema.prisma               # Prisma schema for database structure
│   └── seed.ts                     # Database seed file
├── src
│   ├── config                      # Configuration and logger
│   │   ├── config.ts               # Application configuration
│   │   ├── logger.ts               # Winston logger setup
│   │   └── swagger.ts              # Swagger setup for OpenAPI generation
│   ├── controllers                 # Route controllers
│   │   └── stockController.ts      # Controller for stock-related routes
│   ├── exceptions                  # Custom exceptions for error handling
│   │   └── HttpException.ts        # Base exception class
│   ├── middlewares                 # Express middlewares
│   │   └── errorMiddleware.ts      # Middleware for handling errors
│   ├── routes                      # API routes
│   │   └── stockRoutes.ts          # Routes for stock endpoints
│   ├── services                    # Service layer for business logic
│   │   └── stockService.ts         # Service handling stock-related logic
│   ├── types                       # TypeScript types
│   │   └── stock.ts                # Types for stock and stock prices
│   ├── utils                       # Utility functions
│   │   ├── cronJobUtil.ts          # Utility for starting cron jobs
│   │   ├── errorHandler.ts         # Error handler for async functions
│   │   └── stockApiUtil.ts         # API utility for fetching stock prices
│   └── index.ts                    # Main application entry point
├── .env                            # Environment variables
├── package-lock.json               # Package lock file
├── package.json                    # Project dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # Project documentation
```

### Prerequisites

- **Node.js**: Ensure you have Node.js v20.18.0 or later installed.
- **PostgreSQL**: Make sure you have a running PostgreSQL instance (version 17). 

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/babkristof/stock-price-checker.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:  Create a .env file in the project root with the following contents:
```bash  
    DATABASE_URL="postgresql://postgres:password@localhost:5432/stock"
    FINNHUB_API_KEY="your_finnhub_api_key"
    FINNHUB_URL="https://finnhub.io/api/v1"
    PORT=3000
    NODE_ENV=development
    RECORD_NUMBER_FOR_AVARAGE=10
```

4. Set up the database:
Run Prisma migrations and seed the database with dummy data(optional):
   ```bash
    npx prisma migrate deploy
    npm run seed
   ```
### Usage
1. Start the application:
   ```bash
   npm start
   ```
2. The API will be available at http://localhost:3000.

### Endpoints

#### **GET /stock/:symbol**

Fetch stock data, including current price, last updated time, and moving average.

- **Path Parameters**:
  - `symbol` (string): The stock symbol (e.g., AAPL, TSLA).

- **Responses**:
  - **200 OK**:
    - `symbol` (string): The stock symbol.
    - `currentPrice` (number): The latest price of the stock.
    - `lastUpdated` (string): Timestamp of the last price update.
    - `movingAverage` (number | null): The calculated moving average of the last 10 stock prices.

  Example Response:
  ```json
  {
    "symbol": "AAPL",
    "currentPrice": 145.67,
    "lastUpdated": "2023-10-23T15:53:00Z",
    "movingAverage": 140.50
  }
   ```
  - **400 Bad Request: Validation failed or not enough price data for the stock symbol.**:
  Example Response:
  ```json
  {
    "message": "Not enough price data for AAPL. At least 10 prices are required.",
    "errorCode": 1004
  }
   ```
  - **404 Not Found: Stock or prices not found.**:
  Example Response:
  ```json
  {
    "message": "Stock or prices not found for symbol: AAPL.",
    "errorCode": 1001
  }
   ```

  - **500 Bad Request: Not enough price data for the stock symbol.**:
  Example Response:
  ```json
  {
    "message": "Something went wrong",
    "errorCode": 2001
  }
   ```

#### **PUT /stock/:symbol**

Start periodic stock price checks for a given stock symbol. A cron job will fetch stock prices every minute.

- **Path Parameters**:
  - `symbol` (string): The stock symbol (e.g., AAPL, TSLA).

- **Responses**:
  - **200 OK**:
    - `started` (boolean).

  Example Response:
  ```json
  {
    "started": true,
  }
   ```
  - **400 Bad Request: Validation failed or unprocessable entity.**:
  Example Response:
  ```json
    {
    "message": "Unprocessable entity",
    "errorCode": 1002,
    "errors": ["Invalid stock symbol"]
    }
   ```
  - **404 Not Found: Stock not found.**:
  ```json
    {
    "message": "Stock not found",
    "errorCode": 1001
    }
   ```
  - **409 Conflict: Job already running for the specified stock symbol.**:
  ```json
    {
    "message": "Price check for AAPL is already running.",
    "errorCode": 3001
    }
   ```
  - **500 Internal Server Error:**:
  ```json
    {
    "message": "Something went wrong",
    "errorCode": 2001
    }
   ```