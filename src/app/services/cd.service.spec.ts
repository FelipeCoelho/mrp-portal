import { TestBed } from '@angular/core/testing';
import { CDService } from './cd.service';
import { CD } from '../models/cd.model';

describe('CDService', () => {
  let service: CDService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CDService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('buscarCDsHabilitados', () => {
    it('should return only CDs with habilitadoMRP = true', () => {
      const cdsHabilitados = service.buscarCDsHabilitados();
      
      expect(cdsHabilitados.length).toBeGreaterThan(0);
      expect(cdsHabilitados.every(cd => cd.habilitadoMRP === true)).toBe(true);
    });

    it('should not return CDs with habilitadoMRP = false', () => {
      const cdsHabilitados = service.buscarCDsHabilitados();
      const todosOsCDs = service.lista();
      
      const cdsDesabilitados = todosOsCDs.filter(cd => !cd.habilitadoMRP);
      
      cdsDesabilitados.forEach(cdDesabilitado => {
        expect(cdsHabilitados.find(cd => cd.id === cdDesabilitado.id)).toBeUndefined();
      });
    });

    it('should return CDs with required properties', () => {
      const cdsHabilitados = service.buscarCDsHabilitados();
      
      cdsHabilitados.forEach(cd => {
        expect(cd.id).toBeDefined();
        expect(typeof cd.id).toBe('number');
        expect(cd.nome).toBeDefined();
        expect(typeof cd.nome).toBe('string');
        expect(cd.habilitadoMRP).toBe(true);
      });
    });

    it('should return an array', () => {
      const cdsHabilitados = service.buscarCDsHabilitados();
      
      expect(Array.isArray(cdsHabilitados)).toBe(true);
    });

    it('should return a subset of all CDs', () => {
      const cdsHabilitados = service.buscarCDsHabilitados();
      const todosOsCDs = service.lista();
      
      expect(cdsHabilitados.length).toBeLessThanOrEqual(todosOsCDs.length);
    });
  });

  describe('lista', () => {
    it('should return all CDs including disabled ones', () => {
      const todosOsCDs = service.lista();
      
      expect(todosOsCDs.length).toBeGreaterThan(0);
      
      const temHabilitados = todosOsCDs.some(cd => cd.habilitadoMRP);
      const temDesabilitados = todosOsCDs.some(cd => !cd.habilitadoMRP);
      
      expect(temHabilitados).toBe(true);
      expect(temDesabilitados).toBe(true);
    });
  });
});
