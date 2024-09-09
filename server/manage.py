#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
import threading
import webbrowser
from django.conf import settings
from django.core.management import call_command
from django.db import connections, OperationalError
from django.db.migrations.executor import MigrationExecutor
from django.core.exceptions import ImproperlyConfigured
import pystray
from pystray import MenuItem as item
from PIL import Image, ImageDraw

def show_ascii_art():
    """Display ASCII art on the terminal."""
    art = r"""
 _____               _             
|  __ \             | |            
| |  \/ __ _ _ __ __| | ___ _ __   
| | __ / _` | '__/ _` |/ _ \ '_ \  
| |_\ \ (_| | | | (_| |  __/ | | | 
 \____/\__,_|_|  \__,_|\___|_| |_| 
                                   
    """
    print(art)

def run_migrations():
    """Run database migrations if needed."""
    try:
        # Ensure the default database connection is available
        connection = connections['default']
        connection.prepare_database()
        connection.ensure_connection()

        # Ensure that the app registry is loaded
        from django.apps import apps
        if not apps.ready:
            apps.populate(settings.INSTALLED_APPS)

        # Check for pending migrations
        executor = MigrationExecutor(connection)
        targets = executor.loader.graph.leaf_nodes()
        if executor.migration_plan(targets):
            print("Applying pending migrations...")
            call_command('migrate')
        else:
            print("No pending migrations.")

    except OperationalError:
        # If the database doesn't exist, create it and run initial migrations
        print("Database not found. Creating database and applying initial migrations...")
        call_command('migrate')
    except ImproperlyConfigured:
        print("Database is improperly configured. Please check your settings.")
        sys.exit(1)

def open_browser():
    """Open the browser to the Django server URL."""
    webbrowser.open_new("http://localhost:8000")

def handle_open_browser():
    """Handle the opening of the browser."""
    if os.environ.get('RUN_MAIN') != 'true':
        threading.Thread(target=open_browser).start()

# Tray icon setup
def create_image():
    """Create an icon image for the system tray."""
    image = Image.new('RGB', (64, 64), color=(73, 109, 137))
    draw = ImageDraw.Draw(image)
    draw.rectangle((16, 16, 48, 48), fill='black')
    return image

def on_quit(icon, item):
    """Quit the system tray icon and Django server."""
    icon.stop()
    sys.exit()

def setup_tray():
    """Set up the system tray icon."""
    icon = pystray.Icon("django_server", create_image(), "Garden ERP Server", menu=pystray.Menu(
        item('Quit', on_quit)
    ))
    icon.run()

def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    
    # Log the path to the database
    db_path = settings.DATABASES['default']['NAME']
    print(f"Using database located at: {db_path}")

    # Run migrations before starting the server
    run_migrations()

    # Automatically start the server if no other arguments are provided
    if len(sys.argv) == 1:
        sys.argv.extend(['runserver', '--noreload'])

    # Check if the command is 'runserver' and only then open the browser and system tray
    if 'runserver' in sys.argv and getattr(sys, 'frozen', False):
        # Start a new thread to open the browser
        handle_open_browser()
        show_ascii_art()

        # Start the system tray icon in a separate thread to keep the server running
        threading.Thread(target=setup_tray, daemon=True).start()

    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
