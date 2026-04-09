import { Periodicidade } from './periodicidade.enum';

export interface ConfiguracaoFrequencia {
  id?: number;
  cds: number[];
  categoriaMaterial: string;
  periodicidade: Periodicidade;
  dataInicial: Date;
  dataFinal: Date;
  restricaoTemporal: boolean;
  dataCriacao?: Date;
  horarioCriacao?: string;
  usuarioCriacao?: string;
  dataAlteracao?: Date;
  horarioAlteracao?: string;
  usuarioAlteracao?: string;
}
