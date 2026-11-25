// Data Contracts matching Cloud Firestore schema

export interface AttributeItem {
  id: string;
  value: string;
  isSelected?: boolean;
}

export interface Attribute {
  id: string;
  name: string;
  items: AttributeItem[];
}

export interface Currency {
  label: string; // e.g. "USD", "EUR", "GBP", "JPY", "AUD"
  symbol: string; // e.g. "$", "€", "£", "¥", "A$"
}

export interface Price {
  currency: Currency;
  amount: number;
}

export interface Product {
  id: string;
  name: string;
  category: 'dresses' | 'blouses' | 'jeans' | 'shoes' | string;
  inStock?: boolean;
  gallery: string[];
  description: string;
  attributes: Attribute[];
  prices: Price[];
}

export interface SelectedAttribute {
  attributeId: string;
  attributeValue: string;
}

export interface CartItem extends Product {
  uniqueId: string;
  userSelectedAttributes: SelectedAttribute[];
  quantity: number;
}

export interface OrderCustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface OrderShippingAddress {
  street: string;
  country: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface OrderReceipt {
  orderId: string;
  orderDate: string;
  customer: OrderCustomerInfo;
  shippingAddress: OrderShippingAddress;
  items: CartItem[];
  currencySymbol: string;
  subtotal: number;
  taxes: number;
  total: number;
  paymentMethod: string;
  paymentDetails?: string;
}

export type CategoryKey = 'all' | 'dresses' | 'blouses' | 'jeans' | 'shoes';
