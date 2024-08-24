@echo off

echo Setting up the Flask backend...

:: Navigate to the server directory
cd server

:: Set up the virtual environment
python -m venv venv

:: Activate the virtual environment
call venv\Scripts\activate

:: Install Python dependencies
pip install -r requirements.txt

:: Run database migrations
flask db init
flask db migrate -m "Initial migration."

flask db upgrade

echo Adding sample data...
:: Run the addData.py script

:: Return to the root directory
cd ..

echo Setting up the React frontend...

:: Navigate to the client directory
cd client

:: Install Node.js dependencies
call yarn install

:: Return to the root directory
cd ..

echo Setup complete.
