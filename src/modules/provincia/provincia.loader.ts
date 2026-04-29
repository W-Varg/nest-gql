import { Injectable, Logger, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Provincia } from './entities/provincia.entity';
import { ProvinciaService } from './provincia.service';

@Injectable({ scope: Scope.REQUEST })
export class ProvinciaLoader {
  private readonly logger = new Logger(ProvinciaLoader.name);

  constructor(private readonly provinciaService: ProvinciaService) {}

  readonly byId = new DataLoader<number, Provincia>(async (ids) => {
    this.logger.log(`batch byId ids=[${ids.join(',')}] (size=${ids.length})`);
    const items = this.provinciaService.findByIds(ids as number[]);
    const map = new Map(items.map((p) => [p.id, p]));
    return ids.map((id) => map.get(id) ?? new Error(`Provincia #${id} no encontrada`));
  });
}
