import threading
import webbrowser
import os

from extras.utils import check_if_running, is_pyinstaller

def open_browser():
    """Open the browser to the Django server URL."""
    webbrowser.open_new("http://localhost:8000")

def handle_open_browser():
    """Handle the opening of the browser."""
    if os.environ.get('RUN_MAIN') != 'true':
        threading.Thread(target=open_browser).start()

def open_browser_if_needed():
    """Open the browser only if the server is not already running."""
    if not check_if_running() and is_pyinstaller():
        handle_open_browser()
