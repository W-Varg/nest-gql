import { Module } from '@nestjs/common';
import { PaisService } from './pais.service';
import { PaisResolver } from './pais.resolver';

@Module({
  providers: [PaisResolver, PaisService],
  exports: [PaisService],
})
export class PaisModule {}
