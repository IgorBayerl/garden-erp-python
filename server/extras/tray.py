import os
import sys
import threading
import pystray
from pystray import MenuItem as item
from PIL import Image, ImageDraw
from extras.browser import handle_open_browser

def create_image():
    """Create an icon image for the system tray."""
    image = Image.new('RGB', (64, 64), color=(73, 109, 137))
    draw = ImageDraw.Draw(image)
    draw.rectangle((16, 16, 48, 48), fill='black')
    return image

def on_quit(icon, item):
    """Quit the system tray icon and Django server."""
    icon.stop()

    # Use Django management command to stop the server if possible
    os.system('kill $(lsof -t -i:8000)')  # This will kill the process running on port 8000 (adjust as needed)

    # Then, safely quit the system
    os._exit(0)



def setup_tray():
    """Set up the system tray icon."""
    menu = pystray.Menu(
        item('Open in Browser', handle_open_browser),
        item('Quit', on_quit)
    )

    icon = pystray.Icon("django_server", create_image(), "Garden ERP Server", menu=menu)

    threading.Thread(target=icon.run, daemon=True).start()


