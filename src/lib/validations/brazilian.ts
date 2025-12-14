import { z } from 'zod';
import {
  isValidCPF,
  isValidCNPJ,
  isValidCEP,
  isValidPhone,
} from '@brazilian-utils/brazilian-utils';

export const brazilianPlateRegex = /^[A-Z]{3}-?\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/;
export const cnhRegex = /^\d{11}$/;

export function createBrazilianPlateSchema(errorMessage?: string) {
  return z
    .string()
    .regex(
      brazilianPlateRegex,
      errorMessage || 'Invalid Brazilian license plate format (ABC-1234 or ABC1D23)'
    )
    .transform((val) => val.toUpperCase().replace('-', ''));
}

export function createCPFSchema(errorMessage?: string) {
  return z
    .string()
    .refine((val) => {
      const cleaned = val.replace(/\D/g, '');
      return cleaned.length === 11 && isValidCPF(cleaned);
    }, errorMessage || 'Invalid CPF');
}

export function createCNPJSchema(errorMessage?: string) {
  return z
    .string()
    .refine((val) => {
      const cleaned = val.replace(/\D/g, '');
      return cleaned.length === 14 && isValidCNPJ(cleaned);
    }, errorMessage || 'Invalid CNPJ');
}

export function createCPFOrCNPJSchema(errorMessage?: string) {
  return z
    .string()
    .refine((val) => {
      const cleaned = val.replace(/\D/g, '');
      if (cleaned.length === 11) return isValidCPF(cleaned);
      if (cleaned.length === 14) return isValidCNPJ(cleaned);
      return false;
    }, errorMessage || 'Invalid CPF or CNPJ');
}

export function createCEPSchema(errorMessage?: string) {
  return z
    .string()
    .refine((val) => {
      const cleaned = val.replace(/\D/g, '');
      return cleaned.length === 8 && isValidCEP(cleaned);
    }, errorMessage || 'Invalid CEP');
}

export function createBrazilianPhoneSchema(errorMessage?: string) {
  return z
    .string()
    .refine((val) => {
      const cleaned = val.replace(/\D/g, '');
      return (cleaned.length === 10 || cleaned.length === 11) && isValidPhone(cleaned);
    }, errorMessage || 'Invalid Brazilian phone number');
}

export function createCNHSchema(errorMessage?: string) {
  return z
    .string()
    .regex(cnhRegex, errorMessage || 'Invalid CNH (must be 11 digits)');
}
