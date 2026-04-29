import { Module } from '@nestjs/common';
import { PaisService } from './pais.service';
import { PaisResolver } from './pais.resolver';
import { PaisLoader } from './pais.loader';

@Module({
  providers: [PaisResolver, PaisService, PaisLoader],
  exports: [PaisService, PaisLoader],
})
export class PaisModule {}
