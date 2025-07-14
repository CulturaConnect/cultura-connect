import { cpf, cnpj } from 'cpf-cnpj-validator';

export async function validateCPF(document: string): Promise<boolean> {
  const digits = document.replace(/\D/g, '');
  return cpf.isValid(digits);
}

export async function validateCNPJ(document: string): Promise<boolean> {
  const digits = document.replace(/\D/g, '');
  if (!cnpj.isValid(digits)) return false;

  const url =
    'https://api.allorigins.win/raw?url=' +
    encodeURIComponent(`https://www.receitaws.com.br/v1/cnpj/${digits}`);

  try {
    const res = await fetch(url);
    if (!res.ok) return false;
    const data = await res.json();
    return !(data.status === 'ERROR');
  } catch (err) {
    return false;
  }
}
