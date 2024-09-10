import sys
import socket
from django.db import connections, OperationalError
from django.db.migrations.executor import MigrationExecutor
from django.core.management import call_command
from django.core.exceptions import ImproperlyConfigured
from django.conf import settings

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

def check_if_running():
    """Check if the server is already running on localhost:8000."""
    try:
        sock = socket.create_connection(("localhost", 8000), timeout=1)
        sock.close()
        return True
    except socket.error:
        return False

def is_pyinstaller():
    """Check if the application is running in PyInstaller frozen mode."""
    return getattr(sys, 'frozen', False)


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