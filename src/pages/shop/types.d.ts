export interface ShopSettingsProps {
  name: string;
  primaryCurrency: string;
  extraCurrenciesSupported: string[];
  description: string;
  logo: string;
  version: string;
  userStatus: string[];
  contactAddresses: {
    physical: string;
    email: string;
    countryCode: string;
    phone: string;
    postalCode: string;
  };
  postalOptions: string[];
  paymentOptions: string[];
}
