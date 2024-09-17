import os
import sys
import time
import requests
import zipfile
import shutil
import psutil
import subprocess
import logging
import argparse

logging.basicConfig(
    level=logging.INFO, 
    format='%(asctime)s - %(levelname)s - %(message)s', 
    handlers=[
        logging.FileHandler('updater.log'),
        logging.StreamHandler(sys.stdout)  # This ensures logging to the terminal
    ]
)


# Define the list of files or directories to exclude from replacement
EXCLUDE_LIST = ['db.sqlite3', 'media', 'updater.exe']  # Update this list as needed

def get_current_hash():
    try:
        with open('version.txt', 'r') as f:
            current_hash = f.read().strip()
            logging.info(f"Current hash: {current_hash}")
            return current_hash
    except FileNotFoundError:
        logging.warning("version.txt not found.")
        return None

def get_latest_release_info(repo_owner, repo_name):
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/releases/latest"
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

def is_update_available(current_hash, latest_hash):
    return current_hash != latest_hash

def get_asset_download_url(repo_owner, repo_name, asset_name):
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/releases/latest"
    try:
        response = requests.get(url)
        response.raise_for_status()
        assets = response.json().get('assets', [])
        for asset in assets:
            if asset['name'] == asset_name:
                download_url = asset['browser_download_url']
                logging.info(f"Asset download URL found: {download_url}")
                return download_url
        logging.warning(f"Asset {asset_name} not found in the latest release.")
        return None
    except requests.RequestException as e:
        logging.error(f"Error fetching asset download URL: {e}")
        return None

def download_file(url, output_path):
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
        with open(output_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        logging.info(f"Downloaded file from {url} to {output_path}")
        return True
    except requests.RequestException as e:
        logging.error(f"Error downloading file: {e}")
        return False

def extract_zip(file_path, extract_to):
    try:
        with zipfile.ZipFile(file_path, 'r') as zip_ref:
            zip_ref.extractall(extract_to)
        logging.info(f"Extracted {file_path} to {extract_to}")
    except zipfile.BadZipFile as e:
        logging.error(f"Error extracting zip file: {e}")
        raise

def replace_files(source_dir, target_dir, exclude=[], retries=3, delay=2):
    source_dir = os.path.abspath(source_dir)
    target_dir = os.path.abspath(target_dir)
    for item in os.listdir(source_dir):
        if item in exclude:
            logging.info(f"Excluding {item} from replacement.")
            continue
        s = os.path.join(source_dir, item)
        d = os.path.join(target_dir, item)
        if os.path.exists(d):
            attempt = 0
            while attempt < retries:
                try:
                    if os.path.isdir(d):
                        shutil.rmtree(d)
                    else:
                        os.remove(d)
                    logging.info(f"Removed existing {d}")
                    break
                except Exception as e:
                    logging.error(f"Error removing {d}: {e}")
                    attempt += 1
                    logging.info(f"Retrying in {delay} seconds... (Attempt {attempt}/{retries})")
                    time.sleep(delay)
            else:
                logging.error(f"Failed to remove {d} after {retries} attempts.")
                continue
        try:
            shutil.move(s, d)
            logging.info(f"Moved {s} to {d}")
        except Exception as e:
            logging.error(f"Error moving {s} to {d}: {e}")

def start_application(executable_path):
    try:
        command = [executable_path]
        command.append('--no-browser')
        subprocess.Popen(command)
        logging.info(f"{executable_path} started.")
    except Exception as e:
        logging.error(f"Error starting application: {e}")

def stop_application(process_name):
    try:
        for proc in psutil.process_iter(['name', 'exe', 'cmdline']):
            if process_name.lower() in proc.info['name'].lower():
                proc.terminate()
                try:
                    proc.wait(timeout=10)  # Increased timeout
                    logging.info(f"{process_name} terminated.")
                except psutil.TimeoutExpired:
                    proc.kill()
                    logging.info(f"{process_name} killed after timeout.")
                
                # Double-check if the process has terminated
                if proc.is_running():
                    logging.error(f"Failed to terminate {process_name}.")
                    return False
                return True
        logging.info(f"{process_name} not running.")
        return True
    except psutil.NoSuchProcess:
        logging.info(f"{process_name} already terminated.")
        return True
    except Exception as e:
        logging.error(f"Error stopping {process_name}: {e}")
        return False

def backup_files(files_to_backup, backup_dir='backup'):
    os.makedirs(backup_dir, exist_ok=True)
    for item in files_to_backup:
        if os.path.exists(item):
            try:
                dest = os.path.join(backup_dir, os.path.basename(item))
                if os.path.isdir(item):
                    if os.path.exists(dest):
                        shutil.rmtree(dest)
                    shutil.copytree(item, dest)
                else:
                    shutil.copy2(item, dest)
                logging.info(f"Backed up {item} to {dest}")
            except Exception as e:
                logging.error(f"Error backing up {item}: {e}")

def check_for_updates():
    repo_owner = 'IgorBayerl'
    repo_name = 'garden-erp-python'
    current_hash = get_current_hash()
    latest_hash, published_at = get_latest_release_info(repo_owner, repo_name)
    if not latest_hash:
        logging.error("Could not fetch the latest version hash.")
        print("Could not fetch the latest version information.")
        return

    if is_update_available(current_hash, latest_hash):
        print(f"An update is available.")
        print(f"Latest version hash: {latest_hash}")
        print(f"Published at: {published_at}")
    else:
        print("No updates available.")
        print(f"Current version hash: {current_hash}")
        print(f"Published at: {published_at}")

def update_application():
    repo_owner = 'IgorBayerl'
    repo_name = 'garden-erp-python'
    executable_name = 'GardenErp.exe'
    temp_extract_dir = 'update_temp'
    current_hash = get_current_hash()
    latest_hash, _ = get_latest_release_info(repo_owner, repo_name)

    if not latest_hash:
        logging.error("Could not fetch the latest version hash.")
        return

    if is_update_available(current_hash, latest_hash):
        try:
            logging.info(f"Update available. Current hash: {current_hash}, Latest hash: {latest_hash}")
            asset_name = f'GardenErp-{latest_hash}.zip'
            download_url = get_asset_download_url(repo_owner, repo_name, asset_name)
            if download_url:
                logging.info("Downloading update...")
                if download_file(download_url, 'update.zip'):
                    logging.info("Download complete.")
                    logging.info("Stopping application...")
                    if stop_application(executable_name):
                        logging.info("Waiting for file handles to be released...")
                        time.sleep(2)  # Allow OS to release file handles
                        logging.info("Backing up current files...")
                        backup_files([executable_name, 'static'], backup_dir='backup')
                        logging.info("Applying update...")
                        extract_zip('update.zip', temp_extract_dir)
                        
                        # Dynamically identify the extracted folder
                        extracted_folders = [d for d in os.listdir(temp_extract_dir) if os.path.isdir(os.path.join(temp_extract_dir, d))]
                        if len(extracted_folders) == 1:
                            extracted_folder = os.path.join(temp_extract_dir, extracted_folders[0])
                        else:
                            extracted_folder = temp_extract_dir
                        
                        replace_files(extracted_folder, '.', exclude=EXCLUDE_LIST)
                        
                        # Update version.txt
                        with open('version.txt', 'w') as f:
                            f.write(latest_hash)
                        
                        logging.info("Update applied.")
                        logging.info("Starting application...")
                        start_application(executable_name)
                else:
                    logging.error("Failed to download the update.")
            else:
                logging.error("Update asset not found.")
        except Exception as e:
            logging.error(f"An error occurred during the update: {e}")
        finally:
            # Ensure cleanup
            if os.path.exists('update.zip'):
                os.remove('update.zip')
            if os.path.exists(temp_extract_dir):
                shutil.rmtree(temp_extract_dir)
    else:
        logging.info("No updates available.")


def is_admin():
    try:
        return os.getuid() == 0  # Unix/Linux
    except AttributeError:
        # For Windows
        import ctypes
        try:
            return ctypes.windll.shell32.IsUserAnAdmin()
        except:
            return False

def main():
    # Check for admin privileges without relaunching
    if not is_admin():
        logging.error("Administrator privileges are required to run this script.")
        print("Administrator privileges are required to run this script. Please run the script as an administrator.")
        sys.exit(1)  # Exit with non-zero status to indicate failure

    parser = argparse.ArgumentParser(description='Update application or check for updates.')
    parser.add_argument('--check', '-c', action='store_true', help='Check for updates without applying them.')
    args = parser.parse_args()

    if args.check:
        check_for_updates()
    else:
        update_application()


if __name__ == "__main__":
    main()
