import { Injectable, Logger, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Departamento } from './entities/departamento.entity';
import { DepartamentoService } from './departamento.service';

@Injectable({ scope: Scope.REQUEST })
export class DepartamentoLoader {
  private readonly logger = new Logger(DepartamentoLoader.name);

  constructor(private readonly departamentoService: DepartamentoService) {}

  readonly byId = new DataLoader<number, Departamento>(async (ids) => {
    this.logger.log(`batch byId ids=[${ids.join(',')}] (size=${ids.length})`);
    const items = this.departamentoService.findByIds(ids as number[]);
    const map = new Map(items.map((d) => [d.id, d]));
    return ids.map((id) => map.get(id) ?? new Error(`Departamento #${id} no encontrado`));
  });
}
