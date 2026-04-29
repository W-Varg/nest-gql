import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Pais } from './entities/pais.entity';
import { CreatePaisInput } from './dto/create-pais.input';
import { UpdatePaisInput } from './dto/update-pais.input';

@Injectable()
export class PaisService {
  private readonly logger = new Logger(PaisService.name);
  private items: Pais[] = [{ id: 1, nombre: 'Bolivia', codigoIso: 'BO' }];
  private nextId = 2;

  create(input: CreatePaisInput): Pais {
    const pais: Pais = { id: this.nextId++, ...input };
    this.items.push(pais);
    return pais;
  }

  findAll(): Pais[] {
    return this.items;
  }

  findOne(id: number): Pais {
    this.logger.log(`findOne(${id})`);
    const pais = this.items.find((p) => p.id === id);
    if (!pais) throw new NotFoundException(`Pais #${id} no encontrado`);
    return pais;
  }

  findByIds(ids: readonly number[]): Pais[] {
    this.logger.log(`findByIds([${ids.join(',')}]) (1 batched call for ${ids.length} ids)`);
    const set = new Set(ids);
    return this.items.filter((p) => set.has(p.id));
  }

  update(id: number, input: UpdatePaisInput): Pais {
    const pais = this.findOne(id);
    Object.assign(pais, input);
    return pais;
  }

  remove(id: number): Pais {
    const idx = this.items.findIndex((p) => p.id === id);
    if (idx === -1) throw new NotFoundException(`Pais #${id} no encontrado`);
    const [removed] = this.items.splice(idx, 1);
    return removed;
  }
}
