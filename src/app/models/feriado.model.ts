export interface Feriado {
  data: Date;
  descricao: string;
  tipo: 'NACIONAL' | 'ESTADUAL' | 'MUNICIPAL';
}
