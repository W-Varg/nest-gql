import { Injectable, NotFoundException } from '@nestjs/common';
import { Municipio } from './entities/municipio.entity';
import { CreateMunicipioInput } from './dto/create-municipio.input';
import { UpdateMunicipioInput } from './dto/update-municipio.input';

@Injectable()
export class MunicipioService {
  private items: Municipio[] = [
    { id: 1, nombre: 'La Paz', provinciaId: 1 },
    { id: 2, nombre: 'El Alto', provinciaId: 2 },
    { id: 3, nombre: 'Cochabamba', provinciaId: 3 },
    { id: 4, nombre: 'Santa Cruz de la Sierra', provinciaId: 4 },
  ];
  private nextId = 5;

  create(input: CreateMunicipioInput): Municipio {
    const m: Municipio = { id: this.nextId++, ...input };
    this.items.push(m);
    return m;
  }

  findAll(): Municipio[] {
    return this.items;
  }

  findOne(id: number): Municipio {
    const m = this.items.find((x) => x.id === id);
    if (!m) throw new NotFoundException(`Municipio #${id} no encontrado`);
    return m;
  }

  findByProvincia(provinciaId: number): Municipio[] {
    return this.items.filter((m) => m.provinciaId === provinciaId);
  }

  update(id: number, input: UpdateMunicipioInput): Municipio {
    const m = this.findOne(id);
    Object.assign(m, input);
    return m;
  }

  remove(id: number): Municipio {
    const idx = this.items.findIndex((x) => x.id === id);
    if (idx === -1) throw new NotFoundException(`Municipio #${id} no encontrado`);
    const [removed] = this.items.splice(idx, 1);
    return removed;
  }
}
