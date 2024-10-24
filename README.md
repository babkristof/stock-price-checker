# Stock Price Checker API

A TypeScript-based Express.js API for tracking stock prices and calculating moving averages using a stock market API (e.g., Finnhub). The application also starts periodic checks for stock price updates and saves them to a database.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Running Locally](#running-locally)
  - [Running with Docker](#running-with-docker)
- [API Documentation](#api-documentation)


## Features

- **Track Stock Prices**: Fetch real-time stock prices and calculate moving averages.
- **Cron Job**: Periodic price checks every minute for a specified stock symbol.
- **Error Handling**: Comprehensive error handling with custom exceptions.
- **Logging**: Integrated logging with different log levels for development and production environments.
- **API Documentation**: OpenAPI documentation generation for endpoints.
- **Docker**: Docker and Docker Compose support for simplified setup.


## Tech Stack

- **Node.js** (v20.x or later)
- **TypeScript** (v5.6.3 or later)
- **Express.js**
- **Prisma ORM**
- **PostgreSQL** (or any other relational database)
- **Cron Jobs** with `node-cron`
- **Logging** with `Winston`
- **OpenAPI** for API documentation
- **Docker**


## Project Structure

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
├── Dockerfile                      # Dockerfile for building the application
├── docker-compose.yml              # Docker Compose configuration
├── package-lock.json               # Package lock file
├── package.json                    # Project dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # Project documentation
```

## Getting Started

### Prerequisites

- **Node.js**: Ensure you have Node.js v20.x or later installed.
- **PostgreSQL**: Make sure you have a running PostgreSQL instance (version 17).
- **Docker**


### Running Locally

1. Clone the repository:
```bash
   git clone https://github.com/yourusername/stock-price-checker.git
   cd stock-price-checker
```

2. Install dependencies:
```bash
   npm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory:
   ```bash
    DATABASE_URL=postgresql://postgresUser:postgresPassword@postgresUrl:5432/dbName?schema=public
    FINNHUB_API_KEY=your_finnhub_api_key
    FINNHUB_URL=https://finnhub.io/api/v1
    NODE_ENV=development
    RECORD_NUMBER_FOR_AVARAGE=10
   ```

4. Set up PostgreSQL database:
   Use your local PostgreSQL instance or connect to an existing one. Apply migrations using Prisma:  
   ```bash
   npx prisma migrate deploy
   ```

5. Run the application:
   ```bash
   npm run dev
   ```  

### Running with Docker

To make the process easier, you can use **Docker** and **Docker Compose** to spin up the entire stack (Node.js app + PostgreSQL) with one command.

1. Ensure Docker is installed.

2. Start the application:
   ```bash
   docker-compose up
   ```
   This will:
   - Build the Docker image for the app.
   - Start both the PostgreSQL container and the app container.

3. Access the app:
   The app will be available at http://localhost:3000.

4. Stopping the application:
   To stop and remove the containers:
   ```bash
   docker-compose down
   ```



### Api Documentation
To generate the OpenAPI documentation for this project:
```bash
npm run generate-openapi
```

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