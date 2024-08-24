.PHONY: dev-server dev-client

dev-server:
	@echo "Starting the Flask backend..."
	@cd server && call venv\Scripts\activate && python main.py

dev-client:
	@echo "Starting the React frontend..."
	@cd client && yarn dev

setup:
	@echo "Setting up the Flask backend..."
	@cd server && python -m venv venv
	@cd server && call venv\Scripts\activate && pip install -r requirements.txt
	
	@if not exist "server/migrations" ( \
		echo "Initializing migrations directory..."; \
		cd server && call venv\Scripts\activate && flask db init; \
	) else ( \
		echo "Migrations directory already exists, skipping init step..."; \
	)
	
	@cd server && call venv\Scripts\activate && flask db migrate -m "Initial migration."
	@cd server && call venv\Scripts\activate && flask db upgrade
	@cd ..

	@echo "Setting up the React frontend..."
	@cd client && yarn install
	@cd ..

	@echo "Setup complete."

add-data:
	@echo "Adding sample data..."
	@cd server && call venv\Scripts\activate && python addData.py
	@cd ..
	@echo "Sample data added."