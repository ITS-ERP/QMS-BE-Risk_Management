# Backend System Template

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Architecture](#architecture)
   - [Presentation Layer](#presentation-layer)
   - [Business Logic Layer](#business-logic-layer)
   - [Data Access Layer](#data-access-layer)
4. [Layers and Functions](#layers-and-functions)
   - [Infrastructure Layer](#infrastructure-layer)
   - [Data Access Layer](#data-access-layer)
   - [Business Layer](#business-layer)
   - [Helper Layer](#helper-layer)
   - [Web-Program Layer](#web-program-layer)
5. [Getting Started](#getting-started)
6. [Configuration](#configuration)
7. [Tests](#tests)
8. [Contributing](#contributing)
9. [Commit Message Guidelines](#commit-message-guidelines)
10. [Update Library Dependencies](#update-library-dependencies)
11. [License](#license)

## Overview

This Backend System Template is designed to provide a foundational structure for enterprise backend systems like Enterprise Resource Planning (ERP), Supply Chain Management (SCM), Customer Relationship Management (CRM), and Customer Service Management (CSM). It offers a modular architecture to facilitate the rapid development of backend services and ensure seamless integration with other enterprise systems.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: The project uses Node.js, version `v18.X.X` or later. Download the appropriate version from [nodejs.org](https://nodejs.org/).

- **npm**: The project utilizes npm as the package manager. Verify that you have the latest version installed with `npm -v`.

- **MySQL**: The application requires a MySQL database. Ensure that MySQL is installed and running.

- **Sequelize CLI**: Used to manage database migrations and seeders. It's included in the dev dependencies, but you can also install it globally with `npm install -g sequelize-cli`.

- **TypeScript**: The project is written in TypeScript, and the compiler is included in the dev dependencies. Running `npm install` will install it locally.

- **Other dependencies**: Install all dependencies by running `npm install` from the root of the project.

## Architecture

The system follows a three-tier architecture to ensure scalability, maintainability, and flexibility.

### Presentation Layer

Handles user interaction and presents the user interface. This layer resides in the `web-main` folder, managing the express server and the frontend application.

### Business Logic Layer

Manages the business rules and logic for the application. Located in the `business-layer` folder, it processes commands and enforces rules.

### Data Access Layer

Facilitates access to the database. Found in the `data-access` folder, it abstracts data retrieval and storage operations.

## Layers and Functions

### Infrastructure Layer

- **Location**: `infrastructure` folder
- **Function**: Includes configuration files, database migrations, seeders, models, and interfaces. Sets up the database and establishes how the application interacts with it.

### Data Access Layer

- **Location**: `data-access` folder
- **Function**: Handles data retrieval and persistence. Abstracts the underlying data source and provides an API for the Business Layer.

### Business Layer

- **Location**: `business-layer` folder
- **Function**: Hosts the core business logic, coordinating the application's operations and enforcing business rules.

### Helper Layer

- **Function**: Offers auxiliary functionality that supports other layers, such as shared utilities, validation, or common business rules.

### Web-Program Layer

- **Location**: `web-main` folder
- **Function**: Manages the web application's lifecycle, routing, and controllers. Processes HTTP requests and delegates business processing to the Business Layer.

## API Documentation

The API is documented to make it easy for developers to understand and utilize.

### Postman Collection

A Postman collection is available to assist with API testing:

- [Postman API Documentation](https://documenter.getpostman.com/view/30703660/2s9Yyzcxb2)

### Swagger Documentation (Upcoming)

Swagger documentation is being developed to provide an interactive UI for exploring and testing the API.

## Getting Started

To run the Account Payable system, follow these steps:

1. Install dependencies:

```shell
npm install
```

2. Set up your environment variables by creating a `.env` file in the root directory with the necessary configurations. Use the `.env.example` as a template.

3. Run the database migrations to set up your database schema:

```shell
npm run migrate
```

4. (Optional) Seed the database with initial data if you have seeders set up:

```shell
npm run seed
```

5. Start the server in development mode:

```shell
npm run dev
```

Or, for a production environment, build the project and start the server:

```shell
npm run build
npm start
```

## Configuration

You may need to configure your database connection settings and other environment-specific variables in the infrastructure/config/config.js file or through environment variables in your .env file.

## Tests

To run the tests, use the following command:

```shell
npm test
```

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Commit Message Guidelines

To maintain a clear and consistent commit history, we follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification and the commit message format proposed by [Karma Runner](https://karma-runner.github.io/6.4/dev/git-commit-msg.html). This helps us to automate the versioning process and to generate a readable changelog.

### Format of the Commit Message

- `Type`: This signifies the type of change you're committing. Common types include:
  - `feat`: A new feature
  - `fix`: A bug fix
  - `docs`: Documentation only changes
  - `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semicolons, etc.)
  - `refactor`: A code change that neither fixes a bug nor adds a feature
  - `perf`: A code change that improves performance
  - `test`: Adding missing or correcting existing tests
  - `chore`: Changes to the build process or auxiliary tools and libraries such as documentation generation
- Example of a commit message: `feat: Add a new feature`

## Update Library Dependencies

### Install npm-check-updates globally

```
npm install -g npm-check-updates
```

### Update all dependencies to the latest version

```
ncu -u
```

### Install the updated dependencies

```
npm install
```

## License

Distributed under the MIT License. See LICENSE for more information. Develop with ❤️ by [Kurniacf](https://github.com/kurniacf)
