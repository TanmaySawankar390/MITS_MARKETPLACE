# MITS Marketplace

## Overview

MITS Marketplace is a dedicated platform for MIT students to buy, sell, and exchange educational resources, dormitory essentials, and campus-related items. Our mission is to create a sustainable, community-driven ecosystem that helps students save money while reducing waste on campus.

## Features

- **User Authentication**: Secure signup and login using MIT credentials
- **Item Listings**: Post items with descriptions, images, conditions, and prices
- **Category Browsing**: Find items organized in intuitive categories (Textbooks, Electronics, Furniture, etc.)
- **Search & Filters**: Easily locate specific items through search and multiple filter options
- **Messaging System**: Built-in communication between buyers and sellers
- **Bookmarking**: Save interesting listings for later
- **Transaction Tracking**: Keep track of your buying and selling activities
- **Ratings & Reviews**: Build trust within the community through user feedback

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT, MIT Kerberos integration
- **Storage**: AWS S3 for image uploads
- **Deployment**: AWS/Heroku

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB (local or Atlas connection)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/mits-marketplace.git
cd mits-marketplace
```

2. Install dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables
```bash
# In the server directory, create a .env file
touch .env

# Add the following variables
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_KEY=your_aws_secret_key
AWS_BUCKET_NAME=your_aws_bucket_name
```

4. Run the development server
```bash
# Run backend server
cd server
npm run dev

# In another terminal, run frontend
cd client
npm start
```

## Project Structure

```
mits-marketplace/
├── client/                 # Frontend React application
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   ├── styles/         # Global styles and Tailwind config
│   │   └── utils/          # Helper functions
│   └── package.json
├── server/                 # Backend Node.js/Express application
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── middlewares/        # Express middlewares
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── utils/              # Utility functions
│   └── package.json
└── README.md
```

## API Documentation

The API documentation is available at `/api/docs` when running the development server.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

- [ ] Implement real-time notification system
- [ ] Add secure payment integration for in-platform transactions
- [ ] Develop mobile application
- [ ] Implement AI-based recommendation system
- [ ] Add event-based marketplaces for end-of-semester sales

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- MIT Student Government for supporting this initiative
- All the contributors who have dedicated their time to improve the platform
- MIT Sustainability Office for guidance on sustainable practices

## Contact

For any inquiries or support, please contact us at mitsmarketplace@mit.edu
