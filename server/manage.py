#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
from io import StringIO
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

    # Fallback to dummy stream if no console is available
    if sys.stdout is None:
        sys.stdout = StringIO()
    if sys.stderr is None:
        sys.stderr = StringIO()

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc

    # Initialize the no_browser flag
    no_browser = False

    # Check if '--no-browser' flag is present
    if '--no-browser' in sys.argv:
        no_browser = True
        sys.argv.remove('--no-browser')  # Remove the flag to prevent Django errors

    if check_if_running():
        print("The server is already running.")
        # Open the browser if the server is already running and not suppressed
        if not no_browser:
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
        # Open the browser if '--no-browser' is not set
        if not no_browser:
            # Start a new thread to open the browser
            open_browser_if_needed()
            handle_open_browser()

        show_ascii_art()

        # Start the system tray icon in a separate thread to keep the server running
        if is_pyinstaller():
            threading.Thread(target=setup_tray, daemon=True).start()

    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
