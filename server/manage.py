#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
import threading
from django.conf import settings

from extras.browser import handle_open_browser, open_browser_if_needed
from extras.tray import setup_tray
from extras.utils import check_if_running, is_pyinstaller, run_migrations, show_ascii_art

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
    
    if check_if_running():
        print("The server is already running.")
        # Open the browser if the server is already running
        handle_open_browser()
        sys.exit(1)
    
    # Log the path to the database
    db_path = settings.DATABASES['default']['NAME']
    print(f"Using database located at: {db_path}")

    # Run migrations before starting the server
    run_migrations()

    # Automatically start the server if no other arguments are provided
    if len(sys.argv) == 1:
        sys.argv.extend(['runserver', '--noreload'])

    # Check if the command is 'runserver' and only then open the browser and system tray
    if 'runserver' in sys.argv:
        # Start a new thread to open the browser
        open_browser_if_needed()
        show_ascii_art()

        # Start the system tray icon in a separate thread to keep the server running
        if(is_pyinstaller()):
            threading.Thread(target=setup_tray, daemon=True).start()

    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
