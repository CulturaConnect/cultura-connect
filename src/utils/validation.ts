import { cpf, cnpj } from 'cpf-cnpj-validator';

export async function validateCPF(document: string): Promise<boolean> {
  const digits = document.replace(/\D/g, '');
  return cpf.isValid(digits);
}

export async function validateCNPJ(document: string): Promise<boolean> {
  const digits = document.replace(/\D/g, '');
  if (!cnpj.isValid(digits)) return false;

  try {
    const res = await fetch(`https://publica.cnpj.ws/cnpj/${digits}`);
    if (!res.ok) return false;
    const data = await res.json();
    return !!data.cnpj;
  } catch (err) {
    return false;
  }
}
