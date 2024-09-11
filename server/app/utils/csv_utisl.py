import chardet
import pandas as pd
from io import StringIO

def detect_encoding(file_obj):
    """Detect the encoding of the given file object."""
    raw_data = file_obj.read(1024)  # Read the first 1KB to guess encoding
    result = chardet.detect(raw_data)
    file_obj.seek(0)  # Reset file pointer to the beginning after reading
    return result['encoding']

def convert_to_utf8(file_obj, encoding):
    """Convert the content of a file to UTF-8."""
    # Read the file content using the detected encoding
    file_obj.seek(0)  # Ensure the file pointer is at the beginning before reading
    file_content = file_obj.read().decode(encoding)  # Decode the file using the detected encoding

    # Convert the content to UTF-8
    utf8_content = file_content.encode('utf-8').decode('utf-8')
    return StringIO(utf8_content)  # Return as file-like object for pandas

def validate_columns(df, required_columns):
    """Validate if the required columns are present in the DataFrame."""
    missing_columns = [col for col in required_columns if col not in df.columns]
    if missing_columns:
        raise ValueError(f"Missing required columns in CSV: {missing_columns}")
