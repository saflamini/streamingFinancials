export const cashABI = [
    {
      "inputs": [
        {
          "internalType": "contract ISuperfluid",
          "name": "_host",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint16",
          "name": "category",
          "type": "uint16"
        },
        {
          "indexed": false,
          "internalType": "contract IERC20",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "discretePaymentMade",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "destination",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "contract IERC20",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "erc20CashMoved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "int96",
          "name": "flowRate",
          "type": "int96"
        },
        {
          "indexed": true,
          "internalType": "uint16",
          "name": "category",
          "type": "uint16"
        },
        {
          "indexed": false,
          "internalType": "contract ISuperToken",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "flowCreatedWithCategory",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint16",
          "name": "category",
          "type": "uint16"
        },
        {
          "indexed": false,
          "internalType": "contract ISuperToken",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "flowDeletedWithCategory",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "int96",
          "name": "newFlowRate",
          "type": "int96"
        },
        {
          "indexed": true,
          "internalType": "uint16",
          "name": "category",
          "type": "uint16"
        },
        {
          "indexed": false,
          "internalType": "contract ISuperToken",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "flowUpdatedWithCategory",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "destination",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "contract ISuperToken",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "superTokensMoved",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_accountToAuthorize",
          "type": "address"
        }
      ],
      "name": "authorizeAccount",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "cfaV1",
      "outputs": [
        {
          "internalType": "contract ISuperfluid",
          "name": "host",
          "type": "address"
        },
        {
          "internalType": "contract IConstantFlowAgreementV1",
          "name": "cfa",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_receiver",
          "type": "address"
        },
        {
          "internalType": "int96",
          "name": "_flowRate",
          "type": "int96"
        },
        {
          "internalType": "contract ISuperToken",
          "name": "_token",
          "type": "address"
        },
        {
          "internalType": "uint16",
          "name": "_category",
          "type": "uint16"
        }
      ],
      "name": "createFlow",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_receiver",
          "type": "address"
        },
        {
          "internalType": "contract ISuperToken",
          "name": "_token",
          "type": "address"
        },
        {
          "internalType": "uint16",
          "name": "_category",
          "type": "uint16"
        }
      ],
      "name": "deleteFlow",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "contract IERC20",
          "name": "_token",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_receiver",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        },
        {
          "internalType": "uint16",
          "name": "_category",
          "type": "uint16"
        }
      ],
      "name": "pay",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_accountToRevoke",
          "type": "address"
        }
      ],
      "name": "removeAccountAuthorization",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "contract ISuperToken",
          "name": "_token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amountToUnWrap",
          "type": "uint256"
        }
      ],
      "name": "unWrapSuperTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_receiver",
          "type": "address"
        },
        {
          "internalType": "int96",
          "name": "_flowRate",
          "type": "int96"
        },
        {
          "internalType": "contract ISuperToken",
          "name": "_token",
          "type": "address"
        },
        {
          "internalType": "uint16",
          "name": "_category",
          "type": "uint16"
        }
      ],
      "name": "updateFlow",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_destination",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        },
        {
          "internalType": "contract IERC20",
          "name": "_token",
          "type": "address"
        }
      ],
      "name": "withdrawERC20Tokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_destination",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        },
        {
          "internalType": "contract ISuperToken",
          "name": "_token",
          "type": "address"
        }
      ],
      "name": "withdrawSuperTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "contract ISuperToken",
          "name": "_token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amountToWrap",
          "type": "uint256"
        }
      ],
      "name": "wrapSuperTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]

