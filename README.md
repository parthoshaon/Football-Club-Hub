# Football Club Hub

This is a web application built with Node.js and Express.js that allows users to view information about their favorite football clubs, including upcoming fixtures and match results. The data is retrieved from the Football Data API and stored in a MongoDB database using Mongoose.

## Features

- View a list of available football clubs
- View detailed information about each club, including their crest, stadium, and social media links
- View a list of the club's upcoming fixtures, including the date, time, and opponent
- View the results of the club's previous fixtures, including the scoreline and goal scorers
- Search for clubs by name
- Add new clubs to the database (admin only)

## Getting Started

To get started with the app, clone the repo and then install the necessary dependencies:

npm install

You will also need to obtain an API key from [Football Data API](https://www.football-data.org/) and create a `.env` file in the root directory of the project with the following contents:

API_KEY=YOUR_API_KEY_HERE

To start the app, run the following command:

npm start

Then navigate to [http://localhost:3000](http://localhost:3000) in your web browser to view the app.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- EJS
- Bootstrap

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
