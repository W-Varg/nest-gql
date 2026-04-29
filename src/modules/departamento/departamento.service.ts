import { Injectable, NotFoundException } from '@nestjs/common';
import { Departamento } from './entities/departamento.entity';
import { CreateDepartamentoInput } from './dto/create-departamento.input';
import { UpdateDepartamentoInput } from './dto/update-departamento.input';

@Injectable()
export class DepartamentoService {
  private items: Departamento[] = [
    { id: 1, nombre: 'La Paz', capital: 'La Paz', paisId: 1 },
    { id: 2, nombre: 'Cochabamba', capital: 'Cochabamba', paisId: 1 },
    { id: 3, nombre: 'Santa Cruz', capital: 'Santa Cruz de la Sierra', paisId: 1 },
    { id: 4, nombre: 'Oruro', capital: 'Oruro', paisId: 1 },
    { id: 5, nombre: 'Potosí', capital: 'Potosí', paisId: 1 },
    { id: 6, nombre: 'Chuquisaca', capital: 'Sucre', paisId: 1 },
    { id: 7, nombre: 'Tarija', capital: 'Tarija', paisId: 1 },
    { id: 8, nombre: 'Beni', capital: 'Trinidad', paisId: 1 },
    { id: 9, nombre: 'Pando', capital: 'Cobija', paisId: 1 },
  ];
  private nextId = 10;

  create(input: CreateDepartamentoInput): Departamento {
    const dep: Departamento = { id: this.nextId++, ...input };
    this.items.push(dep);
    return dep;
  }

  findAll(): Departamento[] {
    return this.items;
  }

  findOne(id: number): Departamento {
    const dep = this.items.find((d) => d.id === id);
    if (!dep) throw new NotFoundException(`Departamento #${id} no encontrado`);
    return dep;
  }

  findByPais(paisId: number): Departamento[] {
    return this.items.filter((d) => d.paisId === paisId);
  }

  update(id: number, input: UpdateDepartamentoInput): Departamento {
    const dep = this.findOne(id);
    Object.assign(dep, input);
    return dep;
  }

  remove(id: number): Departamento {
    const idx = this.items.findIndex((d) => d.id === id);
    if (idx === -1) throw new NotFoundException(`Departamento #${id} no encontrado`);
    const [removed] = this.items.splice(idx, 1);
    return removed;
  }
}
