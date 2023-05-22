# CollegeGig Backend

Welcome to the CollegeGig Backend repository! This repository contains the backend code for the CollegeGig web application, a centralized platform designed to meet the diverse needs of college students.

## Technologies Used

- Express.js: A fast and minimalist web application framework for Node.js, used to handle the server-side logic of CollegeGig.
- MongoDB: A flexible and scalable NoSQL database, used to store and retrieve data for CollegeGig.
- JWT (JSON Web Tokens): A secure method for authentication, implemented to ensure the safety of user information.
- bcrypt: A password hashing library used for secure password storage.

## Getting Started

To get started with the CollegeGig Backend, follow the steps below:

### Prerequisites

- Node.js: Make sure you have Node.js installed on your machine. You can download it from the official website: [https://nodejs.org](https://nodejs.org)
- MongoDB: Store the user and notes data
![Screenshot 2023-05-18 082009](https://github.com/MDMOQADDAS/collegeGig-backend/assets/69861558/f415f3ad-2e0c-4fce-a16a-118c87b5fef5)
![Screenshot 2023-05-18 082037](https://github.com/MDMOQADDAS/collegeGig-backend/assets/69861558/f04d5f65-7dad-467c-a106-847a34221682)


### Installation

1. Clone the repository to your local machine:

```bash
git clone https://github.com/MDMOQADDAS/collegeGig-backend.git
```

2. Navigate to the project directory:

```bash
cd collegeGig-backend
```

3. Install the required dependencies:

```bash
npm install
```

### Configuration

1. Create a `.env` file in the root of the project.

2. Provide the required environment variables in the `.env` file. For example:

```plaintext
PORT=3000
MONGODB_URI=mongodb://localhost:27017/collegeGig
JWT_SECRET=your_jwt_secret
```

- `PORT`: The port number on which the server will run (default is 3000).
- `MONGODB_URI`: The MongoDB connection URL.
- `JWT_SECRET`: A secret key used for JWT token generation.

### Running the Server

1. Start the development server:

```bash
npm start
```

2. The server will start running at `http://localhost:3000` (or the port you specified in the `.env` file).

### API Documentation

For detailed information on the CollegeGig Backend API endpoints, refer to the API documentation available at [API Documentation Link].

## Contributing

We welcome contributions to the CollegeGig Backend! If you find any bugs or have suggestions for improvements, please open an issue or submit a pull request. We appreciate your input!

## License

The CollegeGig Backend is open source and released under the [MIT License](LICENSE). Feel free to use, modify, and distribute the code as per the terms of the license.

We hope you enjoy using the CollegeGig Backend and have a great experience with the CollegeGig web application!

Happy coding! 🚀🎓💻
