// 以太坊配置
export const EthConfig = {
  // 确认交易需要等待的区块数
  confirm_wait_blocks: 4,
};

// 钱包交互信息描述前缀 
export const WalletMessage = {
  signIn: 'Sign in m3lab.io',
};

// 合约信息
export const ContractAddress = {
  polygon: 
  {
    MetaPassport: "0x1DdFAF2b3855946F753f29e307be013Dd431b482",
    MetaPassportMinter: "0xDF924dF512F027e32Fa161B4ab0560ADB6845e5E",
    MetaPassportWhitelist: "0xEc87085F28d2e0aa1826aE395bBC2431c9Fd7B53",
    MetaPassportAvatarSet: "0xcaD47fCEf05dD15710946A84eDc7aCAFd0E75e0f",
    MetaPassportAvatarSetConfig: "0xb4B9D8e39F48aE18a1b132Ac8C03862b84304DfD",
    MetaPassportAvatarPart: "0x6920be28EaC0f917008a970A8c63ac4733a406D1",
  },
  binance:
  {
    MetaPassport: "0x23969E59a31Efc286e2098538fDA17111EFccb2B",
    MetaPassportMinter: "0x9058375B357BC38FE349Ee53d83710575818Ae46",
    MetaPassportWhitelist: "0x37FD9296AF51E1F42Ed23F19a2e023895e31c47d",
    MetaPassportAvatarSet: "0xA023e16b5424A2F8A42254893E0f82BB7286c0d5",
    MetaPassportAvatarSetConfig: "0x0a5b00389A1f809083Ea2061f9E3153385A94f8D",
    MetaPassportAvatarPart: "0x766289cc770Ba1beFa518cC976e87885804a8a12",
  }
}

// 合约事件
export const ContractEvents = {
  MetaPassport: ['MetaPassportMint'],
  MetaPassportMinter: ['MintOrderCreated', 'MintOrderHandled'],
}

/**
 * 链节点列表
 */
 export const blockchain_rpc_url = {
  polygon:
  [
    'https://matic-mumbai.chainstacklabs.com',
  ],
  // polygon: 
  // [
  //   'https://rpc-mainnet.matic.quiknode.pro',
  //   'https://rpc-mainnet.maticvigil.com',
  //   'https://matic-mainnet.chainstacklabs.com',
  // ],
  binance: 
  [
    'https://data-seed-prebsc-1-s1.binance.org:8545/',
    'https://data-seed-prebsc-2-s1.binance.org:8545/',
    'https://data-seed-prebsc-1-s2.binance.org:8545/',
    'https://data-seed-prebsc-2-s2.binance.org:8545/',
    'https://data-seed-prebsc-1-s3.binance.org:8545/',
    'https://data-seed-prebsc-2-s3.binance.org:8545/',
  ]
}







