export const CURRENCIES = [
    { code: 'DH', label: 'DH (Maroc/Général)', symbol: 'DH' },
    { code: 'TND', label: 'TND (Tunisie)', symbol: 'DT' },
    { code: 'MAD', label: 'MAD (Maroc)', symbol: 'MAD' },
    { code: 'EUR', label: 'EUR (Europe)', symbol: '€' },
    { code: 'USD', label: 'USD (US Dollar)', symbol: '$' },
    { code: 'DZD', label: 'DZD (Algérie)', symbol: 'DA' },
    { code: 'XOF', label: 'CFA (Afrique de l\'Ouest)', symbol: 'CFA' },
] as const;

export type CurrencyCode = typeof CURRENCIES[number]['code'];
