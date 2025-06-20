import type { EmpresaPendente } from "../types/types";
import styles from '../styles/EmpresaCard.module.css'

interface EmpresaCardProps {
    empresa: EmpresaPendente;
    onClick: (empresa: EmpresaPendente) => void;
}

const EmpresaCard = ({ empresa, onClick }: EmpresaCardProps) => {
    return (
    <div
      className={styles.card}
      onClick={() => onClick(empresa)}
      style={{ cursor: 'pointer' }}
    >
      <h3>{empresa.nome}</h3>
      <p><strong>CNPJ:</strong> {empresa.cnpj}</p>
      <p><strong>Número da Conta:</strong> {empresa.numeroConta}</p>
      <p><strong>Status:</strong> {empresa.status === 1 ? 'Ativo' : 'Pendente'}</p>
      <p><strong>Descrição:</strong> {empresa.descricao}</p>
    </div>
  );
};

export default EmpresaCard;