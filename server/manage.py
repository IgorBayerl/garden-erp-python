#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
from django.conf import settings
from io import StringIO

from extras.utils import check_if_running, run_migrations

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
    
    if check_if_running():
        print("The server is already running.")
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

    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
