--Setup--

Frontend:
Inside frontend folder, run below codes to install react node modules
    
    npm install

To install tailwind CSS, 
    
    npm install tailwindcss @tailwindcss/vite

Install router dom,
    
    npm install react-router-dom

Install react icons,
   
    npm install react-icons
    
Install heroicons to frontend.
    
    npm i @heroicons/react

Install framer motion,
    
    npm i framer-motion

Install lucide icons,
    
    npm i lucide-react

To display toast messages,
    
    npm install react-toastify





Backend:
Inside backend folder, run following codes
    
    npm init -y
    npm install express

Install nodemon to keep constant development process
    
    npm install -g nodemon
    npm install --save-dev nodemon

Install mongoose
   
    npm install mongoose --save
    npm install mongoose

Set .env
    
    npm i dotenv

Allow frontend to call backend:cors, session handling:JWT, password hassing:bcryptjs
    
    npm install cors jsonwebtoken bcryptjs
    npm install jwt-decode
    npm install axios






Run the app:
Connect to mongoDB and create a collection.
Copy the url and paste it in the .env file created in backend root directory
    
    example: DB_URL = mongodb://localhost:27017/bookstore

Inside the frontend/src/components/Hero.jsx there is a function to fetchBooks. Inside it there is the google books API.
Generate a book API key and paste the key instead of the part YOURAPIKEY in the url given there

Inside backend terminal run,
   
    node server.js

Inside frontend terminal run,
    
    npm run dev

