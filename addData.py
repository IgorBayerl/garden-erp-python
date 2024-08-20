import requests
import json

BASE_URL = 'http://127.0.0.1:5000'

def add_piece(name, sizeX, sizeY, sizeZ):
    response = requests.post(f'{BASE_URL}/add_piece', json={
        'name': name,
        'sizeX': sizeX,
        'sizeY': sizeY,
        'sizeZ': sizeZ
    })
    print(response.json())

def add_product(name):
    response = requests.post(f'{BASE_URL}/add_product', json={
        'name': name
    })
    print(response.json())
    return response.json().get('id')

def add_product_piece(product_id, piece_id, quantity):
    response = requests.post(f'{BASE_URL}/add_product_piece', json={
        'product_id': product_id,
        'piece_id': piece_id,
        'quantity': quantity
    })
    print(response.json())

# def add_production_order(products):
#     response = requests.post(f'{BASE_URL}/add_production_order', json={
#         'products': products
#     })
#     print(response.json())

def main():
    # Add pieces
    # add_piece("Pé Piquenique", 743, 78, 35)
    # add_piece("Pé Tras Dir Cad Piquenique", 835, 117, 30)
    # add_piece("Pé Frontal Dir Piquenique", 450, 50, 30)
    # add_piece("Pé Frontal Esq Piquenique", 450, 50, 30)

    # Add products
    # product1_id = add_product("Mesa 757 Piquenique")
    # product2_id = add_product("Cadeira Piquenique")

    # # Add product-piece relationships
    # add_product_piece(product1_id, 1, 4)
    # add_product_piece(product2_id, 2, 1)
    # add_product_piece(product2_id, 3, 1)
    # add_product_piece(product2_id, 4, 1)


    # # Add a production order
    # add_production_order([
    #     {'product_id': product1_id, 'quantity': 5},
    #     {'product_id': product2_id, 'quantity': 20}
    # ])

if __name__ == '__main__':
    main()
