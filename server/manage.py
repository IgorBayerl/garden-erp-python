#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
from django.core.management import call_command
from django.db import connections, OperationalError
from django.db.migrations.executor import MigrationExecutor
from django.core.exceptions import ImproperlyConfigured
from django.conf import settings  # Import the settings module

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
    
    # Run migrations before starting the server
    run_migrations()

    # Automatically start the server if no other arguments are provided
    if len(sys.argv) == 1:
        sys.argv.extend(['runserver', '--noreload'])

    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
