import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Provincia } from './entities/provincia.entity';
import { CreateProvinciaInput } from './dto/create-provincia.input';
import { UpdateProvinciaInput } from './dto/update-provincia.input';

@Injectable()
export class ProvinciaService {
  private readonly logger = new Logger(ProvinciaService.name);
  private items: Provincia[] = [
    { id: 1, nombre: 'Murillo', departamentoId: 1 },
    { id: 2, nombre: 'Pedro Domingo Murillo', departamentoId: 1 },
    { id: 3, nombre: 'Cercado', departamentoId: 2 },
    { id: 4, nombre: 'Andrés Ibáñez', departamentoId: 3 },
    { id: 5, nombre: 'Cercado', departamentoId: 4 },
    { id: 6, nombre: 'Tomás Frías', departamentoId: 5 },
    { id: 7, nombre: 'Oropeza', departamentoId: 6 },
    { id: 8, nombre: 'Cercado', departamentoId: 7 },
    { id: 9, nombre: 'Cercado', departamentoId: 8 },
    { id: 10, nombre: 'Nicolás Suárez', departamentoId: 9 },
  ];
  private nextId = 11;

  create(input: CreateProvinciaInput): Provincia {
    const p: Provincia = { id: this.nextId++, ...input };
    this.items.push(p);
    return p;
  }

  findAll(): Provincia[] {
    return this.items;
  }

  findOne(id: number): Provincia {
    this.logger.log(`findOne(${id})`);
    const p = this.items.find((x) => x.id === id);
    if (!p) throw new NotFoundException(`Provincia #${id} no encontrada`);
    return p;
  }

  findByIds(ids: readonly number[]): Provincia[] {
    this.logger.log(`findByIds([${ids.join(',')}]) (1 batched call for ${ids.length} ids)`);
    const set = new Set(ids);
    return this.items.filter((p) => set.has(p.id));
  }

  findByDepartamento(departamentoId: number): Provincia[] {
    return this.items.filter((p) => p.departamentoId === departamentoId);
  }

  update(id: number, input: UpdateProvinciaInput): Provincia {
    const p = this.findOne(id);
    Object.assign(p, input);
    return p;
  }

  remove(id: number): Provincia {
    const idx = this.items.findIndex((x) => x.id === id);
    if (idx === -1) throw new NotFoundException(`Provincia #${id} no encontrada`);
    const [removed] = this.items.splice(idx, 1);
    return removed;
  }
}
