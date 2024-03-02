# NC - News API

## Introduction

This repository contains an API that interacts with application data programmatically. The API will be used to provide information for the front-end architecture in a future repository.

## Getting Started

Follow the steps below to set up the project on your local machine.

### Prerequisites

Make sure you have the following software installed:

- Node.js v20.9.0 (Minimum Node version requirement: 14.10 for Homebrew, server 16.1)

### Installation

1. Clone this repository to your local machine:

   ```
   git clone https://github.com/your-username/your-repo.git

   ```
   
Navigate to the project directory:

```
cd your-repo
```

Install project dependencies:

```
npm install
```

Set up databases:

```
npm run setup-dbs
```

Seed the databases:

```
npm run seed
```

Run tests:

```
npm run test
```

### Environment Variables

Create two .env files in the project root:

.env.test including:

```
PGDATABASE=[link-to-test-data]
```

.env.development including:

```
PGDATABASE=[link-to-development-data]
```

Make sure to replace [link-to-test-data] and [link-to-development-data] with the appropriate links to your test and development databases.

Database Connection

The databases connect to your database via the 'pg' library in the db/connection.js file. Ensure that your database configurations are correct in this file.

