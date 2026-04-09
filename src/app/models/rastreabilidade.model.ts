export interface Rastreabilidade {
  id: number;
  descricao: string;
  dataCriacao: string;
  horarioCriacao: string;
  usuarioCriacao: string;
  dataAlteracao?: string;
  horarioAlteracao?: string;
  usuarioAlteracao?: string;
}
