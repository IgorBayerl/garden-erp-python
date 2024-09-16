# Add system utils endpoints here, update for example.

import ctypes
import os
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO, 
    format='%(asctime)s - %(levelname)s - %(message)s', 
    handlers=[
        logging.FileHandler('updater.log'),
        logging.StreamHandler()
    ]
)

# GitHub repository details
REPO_OWNER = 'IgorBayerl'
REPO_NAME = 'garden-erp-python'

def get_current_hash():
    try:
        with open('version.txt', 'r') as f:
            current_hash = f.read().strip()
            logging.info(f"Current hash: {current_hash}")
            return current_hash
    except FileNotFoundError:
        logging.warning("version.txt not found.")
        return None

def get_latest_release_info():
    url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/releases/latest"
    try:
        response = requests.get(url)
        response.raise_for_status()
        release = response.json()
        latest_hash = release['tag_name']
        published_at = release['published_at']
        logging.info(f"Latest hash retrieved: {latest_hash}, published at: {published_at}")
        return latest_hash, published_at
    except requests.RequestException as e:
        logging.error(f"Error fetching release information: {e}")
        return None, None

class CheckUpdateView(APIView):
    def get(self, request):
        current_hash = get_current_hash()
        latest_hash, published_at = get_latest_release_info()
        if not latest_hash:
            return Response(
                {"message": "Could not fetch the latest version information."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        update_available = current_hash != latest_hash

        return Response({
            "update_available": update_available,
            "current_version": current_hash,
            "latest_version": latest_hash,
            "published_at": published_at
        })


class RunUpdaterView(APIView):
    def post(self, request):
        # Path to updater.exe
        updater_path = os.path.abspath('updater.exe')

        if not os.path.exists(updater_path):
            return Response(
                {"message": "Updater executable not found."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        try:
            # For Windows: Use ShellExecute to run as admin
            updater_path = updater_path.replace('/', '\\')

            # Run the updater.exe as admin
            ctypes.windll.shell32.ShellExecuteW(
                None, "runas", updater_path, None, None, 1
            )

            logging.info("Updater started.")
            return Response({"message": "Updater started."})
        except Exception as e:
            logging.error(f"Failed to start updater: {e}")
            return Response(
                {"message": f"Failed to start updater: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
