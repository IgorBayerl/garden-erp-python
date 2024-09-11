import pandas as pd
from app.utils.csv_utisl import convert_to_utf8, detect_encoding, validate_columns

def parse_csv(file_obj):
    """Parse the CSV file and return a list of pieces."""
    # Detect the file encoding
    encoding = detect_encoding(file_obj)

    # Convert the file content to UTF-8
    utf8_file_obj = convert_to_utf8(file_obj, encoding)

    # Read the CSV file using pandas from the UTF-8 content
    df = pd.read_csv(utf8_file_obj, delimiter=',')

    # Validate the necessary columns
    required_columns = ['Peça', 'Comp.', 'Larg.', 'Esp.', 'Qtd.']
    validate_columns(df, required_columns)

    # Prepare pieces data from CSV
    pieces_data = []
    for _, row in df.iterrows():
        piece_data = {
            'name': row['Peça'],   # Piece name
            'sizeX': row['Comp.'],  # Comprimento
            'sizeY': row['Larg.'],  # Largura
            'sizeZ': row['Esp.'],   # Espessura
            'quantity': row['Qtd.']  # Quantity
        }
        pieces_data.append(piece_data)

    return pieces_data
