import requests

BASE_URL = 'http://127.0.0.1:8000'

def add_piece(name, sizeX, sizeY, sizeZ):
    response = requests.post(f'{BASE_URL}/pieces/', json={
        'name': name,
        'sizeX': sizeX,
        'sizeY': sizeY,
        'sizeZ': sizeZ
    })
    result = response.json()
    print(result)
    return result.get('id')  # Return the ID of the newly created piece

def add_product_with_pieces(name, pieces):
    response = requests.post(f'{BASE_URL}/products/', json={
        'name': name,
        'product_pieces': pieces
    })
    result = response.json()
    print(result)
    return result.get('product_id')

def add_production_order(products):
    response = requests.post(f'{BASE_URL}/orders/calculate/', json={
        'products': products
    })
    print(response.json())

def main():
    # Add pieces and store their IDs
    piece1_id = add_piece("000 Pé Piquenique", 743, 78, 35)
    piece2_id = add_piece("000 Pé Tras Dir Cad Piquenique", 835, 117, 30)
    piece3_id = add_piece("000 Pé Frontal Dir Piquenique", 450, 50, 30)
    piece4_id = add_piece("000 Pé Frontal Esq Piquenique", 450, 50, 30)

    # Add products with their related pieces using the returned IDs
    product1_id = add_product_with_pieces("000 Mesa 757 Piquenique", [
        {'piece_id': piece1_id, 'quantity': 4}
    ])
    product2_id = add_product_with_pieces("000 Cadeira Piquenique", [
        {'piece_id': piece2_id, 'quantity': 1},
        {'piece_id': piece3_id, 'quantity': 1},
        {'piece_id': piece4_id, 'quantity': 1}
    ])

if __name__ == '__main__':
    main()
