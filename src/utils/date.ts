import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Formata uma data para o padrão brasileiro (dd/MM/yyyy)
 * @param date - Data em formato ISO string, Date object ou timestamp
 * @returns String formatada em pt-BR ou string vazia se inválida
 */
export function formatDateToPTBR(date: string | Date | number): string {
  if (!date) return '';
  
  try {
    let dateObj: Date;
    
    if (typeof date === 'string') {
      // Se for string ISO (YYYY-MM-DD), converte para Date
      dateObj = parseISO(date);
    } else if (typeof date === 'number') {
      // Se for timestamp
      dateObj = new Date(date);
    } else {
      // Se já for Date object
      dateObj = date;
    }
    
    if (!isValid(dateObj)) {
      return '';
    }
    
    return format(dateObj, 'dd/MM/yyyy', { locale: ptBR });
  } catch (error) {
    console.warn('Erro ao formatar data:', error);
    return '';
  }
}

/**
 * Formata uma data com hora para o padrão brasileiro (dd/MM/yyyy HH:mm)
 * @param date - Data em formato ISO string, Date object ou timestamp
 * @returns String formatada em pt-BR com hora ou string vazia se inválida
 */
export function formatDateTimeToPTBR(date: string | Date | number): string {
  if (!date) return '';
  
  try {
    let dateObj: Date;
    
    if (typeof date === 'string') {
      dateObj = parseISO(date);
    } else if (typeof date === 'number') {
      dateObj = new Date(date);
    } else {
      dateObj = date;
    }
    
    if (!isValid(dateObj)) {
      return '';
    }
    
    return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: ptBR });
  } catch (error) {
    console.warn('Erro ao formatar data e hora:', error);
    return '';
  }
}

/**
 * Converte uma data do formato brasileiro (dd/MM/yyyy) para ISO (yyyy-MM-dd)
 * @param dateString - Data no formato dd/MM/yyyy
 * @returns String no formato ISO ou string vazia se inválida
 */
export function formatDateToISO(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const [day, month, year] = dateString.split('/');
    
    if (!day || !month || !year) {
      return '';
    }
    
    const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const dateObj = parseISO(isoDate);
    
    if (!isValid(dateObj)) {
      return '';
    }
    
    return isoDate;
  } catch (error) {
    console.warn('Erro ao converter data para ISO:', error);
    return '';
  }
}

/**
 * Formata um valor monetário para o padrão brasileiro
 * @param value - Valor numérico
 * @returns String formatada como moeda brasileira
 */
export function formatCurrencyToPTBR(value: number): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return 'R$ 0,00';
  }
  
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

/**
 * Formata um número para o padrão brasileiro (separador de milhares)
 * @param value - Valor numérico
 * @returns String formatada com separadores brasileiros
 */
export function formatNumberToPTBR(value: number): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0';
  }
  
  return value.toLocaleString('pt-BR');
}