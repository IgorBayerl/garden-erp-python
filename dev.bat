@echo off

echo Starting the Flask backend...

:: Navigate to the server directory and activate the virtual environment, then start the Flask server
start "Flask Server" cmd /c "cd server && call venv\Scripts\activate && python run.py"

echo Starting the React frontend...

:: Navigate to the client directory and start the React development server
start "React Client" cmd /c "cd client && yarn dev"

echo Both the Flask backend and React frontend are starting...
