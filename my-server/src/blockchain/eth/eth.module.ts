import { Module, Global } from '@nestjs/common';
import { EthService } from './eth.service';
import { EthContractMint } from './contract/eth.contract.mint';
import { EthContractMp } from './contract/eth.contract.mp';

@Global()
@Module({
  providers: [
    EthService,
    EthContractMint,
    EthContractMp,
  ],
  exports: [
    EthService,
    EthContractMint,
    EthContractMp,
  ],
})
export class EthModule {}
