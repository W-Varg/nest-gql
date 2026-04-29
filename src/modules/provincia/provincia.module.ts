import { Module } from '@nestjs/common';
import { ProvinciaService } from './provincia.service';
import { ProvinciaResolver } from './provincia.resolver';

@Module({
  providers: [ProvinciaResolver, ProvinciaService],
  exports: [ProvinciaService],
})
export class ProvinciaModule {}
