export const CONTRACT_ADDRESSES = {
  AXIE: "0x32950db2a7164ae833121501c797d79e7b79d74c",
  MARKETPLACE_V2: "0x3b3adf1422f84254b7fbb0e7ca62bd0865133fe3",
  WETH: "0xc99a6a985ed2cac1ef41640596c5a5f9f4e19ef5",
  ERC721_BATCH_TRANSFER: "0x2368dfed532842db89b470fde9fd584d48d4f644",
};

export const ABI_FILES = {
  AXIE: [
    {
      constant: true,
      inputs: [
        {
          internalType: "address",
          name: "_owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "_operator",
          type: "address",
        },
      ],
      name: "isApprovedForAll",
      outputs: [
        {
          internalType: "bool",
          name: "_approved",
          type: "bool",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          internalType: "address",
          name: "_operator",
          type: "address",
        },
        {
          internalType: "bool",
          name: "_approved",
          type: "bool",
        },
      ],
      name: "setApprovalForAll",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        {
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
      ],
      name: "ownerOf",
      outputs: [
        {
          internalType: "address",
          name: "_owner",
          type: "address",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
  ],
  BATCH_TRANSFER: [
    {
      constant: false,
      inputs: [
        {
          internal_type: "",
          name: "_tokenContract",
          type: "address",
        },
        {
          internal_type: "",
          name: "_ids",
          type: "uint256[]",
        },
        {
          internal_type: "",
          name: "_recipient",
          type: "address",
        },
      ],
      name: "safeBatchTransfer",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
      anonymous: false,
    },
  ],
};

export const ORDER_EXPIRATION = 15634800; // ~ 6 months
