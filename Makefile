# Makefile for GardenErp project (Windows)

# Variables
PYTHON_VERSION = 3.12
NODE_VERSION = 22
SERVER_DIR = server
CLIENT_DIR = client
DIST_DIR = $(subst /,\,$(SERVER_DIR)/dist)
MEDIA_DIR = $(subst /,\,$(SERVER_DIR)/media)
STATIC_DIR = $(subst /,\,$(SERVER_DIR)/static)

# Setup: Install dependencies for both client and server
setup:
	cd $(CLIENT_DIR) && npx yarn install -y

	python -m pip install --upgrade pip
	cd $(SERVER_DIR) && pip install -r requirements.txt

# Build client and server
build: build-client build-server

# Build the client
build-client:
	cd $(CLIENT_DIR) && npx yarn build

# Build the server
build-server:
	@if exist $(DIST_DIR) rmdir /S /Q $(DIST_DIR)
	cd $(SERVER_DIR) && python manage.py collectstatic --noinput
	cd $(SERVER_DIR) && pyinstaller GardenErp.spec

# Clean: Remove dist, media, and static files (Windows version)
clean:
	@if exist $(DIST_DIR) rmdir /S /Q $(DIST_DIR)
	@if exist $(MEDIA_DIR) rmdir /S /Q $(MEDIA_DIR)
	@if exist $(STATIC_DIR) rmdir /S /Q $(STATIC_DIR)
