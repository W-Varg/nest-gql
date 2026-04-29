import { Injectable, Logger, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Pais } from './entities/pais.entity';
import { PaisService } from './pais.service';

@Injectable({ scope: Scope.REQUEST })
export class PaisLoader {
  private readonly logger = new Logger(PaisLoader.name);

  constructor(private readonly paisService: PaisService) {}

  readonly byId = new DataLoader<number, Pais>(async (ids) => {
    this.logger.log(`batch byId ids=[${ids.join(',')}] (size=${ids.length})`);
    const items = this.paisService.findByIds(ids as number[]);
    const map = new Map(items.map((p) => [p.id, p]));
    return ids.map((id) => map.get(id) ?? new Error(`Pais #${id} no encontrado`));
  });
}
