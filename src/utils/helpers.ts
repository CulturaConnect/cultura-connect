export function censurarDocumento(documento: string | null): string {
  if (!documento) return '';

  // Remove formatação existente (pontos, traços, barras)
  const apenasNumeros = documento.replace(/\D/g, '');

  if (apenasNumeros.length === 11) {
    // CPF: mostra os 3 primeiros e 2 últimos dígitos
    // Formato: 123.***.***-12
    return apenasNumeros.replace(/(\d{3})\d{6}(\d{2})/, '$1.***.***-$2');
  } else if (apenasNumeros.length === 14) {
    // CNPJ: mostra os 2 primeiros e 4 últimos dígitos
    // Formato: 12.***.***/****-1234
    return apenasNumeros.replace(/(\d{2})\d{8}(\d{4})/, '$1.***.***/****-$2');
  }

  // Se não for CPF nem CNPJ válido, censura deixando apenas os últimos 4 dígitos
  return '*'.repeat(apenasNumeros.length - 4) + apenasNumeros.slice(-4);
}
