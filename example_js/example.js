const example = {
  id: 1,
  created_at: "2020-01-01T00:00:00.000Z",
  products: [
    {
      id: 1,
      name: "Mesa 757 Piquenique",
      quantity: 5,
      pieces: [
        {
          id: 1,
          name: "Pé Piquenique",
          quantity: 4,
          sizeX: 743,
          sizeY: 78,
          sizeZ: 35,
        }
      ]
    },
    {
      id: 2,
      name: "Mesa 1380 Piquenique",
      quantity: 5,
      pieces: [
        {
          id: 1,
          name: "Pé Piquenique",
          quantity: 4,
          sizeX: 743,
          sizeY: 78,
          sizeZ: 35,
        }
      ]
    },
    {
      id: 3,
      name: "Mesa 1800 Piquenique",
      quantity: 5,
      pieces: [
        {
          id: 1,
          name: "Pé Piquenique",
          quantity: 4,
          sizeX: 743,
          sizeY: 78,
          sizeZ: 35,
        }
      ]
    },
    {
      id: 4,
      name: "Cadeira Piquenique",
      quantity: 20,
      pieces: [
        {
          id: 2,
          name: "Pé Tras Dir Cad Piquenique",
          quantity: 1,
          sizeX: 835,
          sizeY: 117,
          sizeZ: 30,
        },
        {
          id: 3,
          name: "Pé Tras Esq Cad Piquenique",
          quantity: 1,
          sizeX: 835,
          sizeY: 117,
          sizeZ: 30,
        },
        {
          id: 4,
          name: "Pé Frontal Dir Piquenique",
          quantity: 1,
          sizeX: 450,
          sizeY: 50,
          sizeZ: 30,
        },
        {
          id: 5,
          name: "Pé Frontal Esq Piquenique",
          quantity: 1,
          sizeX: 450,
          sizeY: 50,
          sizeZ: 30,
        },
        {
          id: 6,
          name: "Ripa Lat Assento",
          quantity: 2,
          sizeX: 450,
          sizeY: 90,
          sizeZ: 20,
        },
        {
          id: 7,
          name: "Ripa Lat Encosto",
          quantity: 2,
          sizeX: 250,
          sizeY: 90,
          sizeZ: 20,
        }
      ]
    },
  ]
}

/**
 * Calculate the total number of pieces to be produced for a given pieceId
 * @param {number} pieceId
 * @returns {number}
 */
const totalPiecesByPieceId = (pieceId) => {
  let total = 0
  let productsWithTargetPiece = []

  example.products.forEach(product => {
    product.pieces.forEach(piece => {
      if (piece.id === pieceId) {
        const totalPiecesForProduct = piece.quantity * product.quantity
        total += totalPiecesForProduct
      }
    })
  })

  return total
}

// Order the pieces by the sizes, and group the pieces with the same size and show quantity to be produced
const groupPiecesBySize = () => {
  let piecesBySize = {}

  example.products.forEach(product => {
    product.pieces.forEach(piece => {
      const sizeKey = `${piece.sizeX}x${piece.sizeY}x${piece.sizeZ}`
      if (!piecesBySize[sizeKey]) {
        piecesBySize[sizeKey] = {
          size: sizeKey,
          totalQuantity: 0
        }
      }
      piecesBySize[sizeKey].totalQuantity += piece.quantity * product.quantity
    })
  })

  return Object.values(piecesBySize).sort((a, b) => a.size.localeCompare(b.size))
}

const aggregatePiecesData = () => {
  let piecesBySize = {};

  example.products.forEach(product => {
    product.pieces.forEach(piece => {
      const sizeKey = `${piece.sizeX}x${piece.sizeY}x${piece.sizeZ}`;
      if (!piecesBySize[sizeKey]) {
        piecesBySize[sizeKey] = {
          size: sizeKey,
          totalQuantity: 0,
          details: [],
        };
      }
      const totalPiecesForProduct = piece.quantity * product.quantity;
      piecesBySize[sizeKey].totalQuantity += totalPiecesForProduct;
      piecesBySize[sizeKey].details.push({
        product: product.name,
        piece: piece.name,
        quantity: piece.quantity,
        productQuantity: product.quantity,
        totalPiecesForProduct,
      });
    });
  });

  return Object.values(piecesBySize).sort((a, b) => a.size.localeCompare(b.size));
};

const prepareDataForVisualization = (aggregatedData) => {
  return aggregatedData.map(data => {
    return {
      size: data.size,
      totalQuantity: data.totalQuantity,
      details: data.details,
    };
  });
};

const aggregatedData = aggregatePiecesData();
const visualizationData = prepareDataForVisualization(aggregatedData);
console.log(visualizationData);


// console.log(groupPiecesBySize())

// const pieceId = 1
// console.log(totalPiecesByPieceId(4))