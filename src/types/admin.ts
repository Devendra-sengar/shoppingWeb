// Extended Type Definitions for ÉLAN Admin, Inventory, Orders, Fulfillment, and Settings

import type { OrderCustomerInfo, OrderShippingAddress } from './index';

export type AdminRole = 
  | 'super_admin'
  | 'store_manager'
  | 'catalog_manager'
  | 'fulfillment_staff'
  | 'support_staff'
  | 'finance_staff';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
}

// Fulfillment States as specified
export type FulfillmentStatus = 
  | 'received'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'ready_for_dispatch'
  | 'dispatched'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus =
  | 'pending'
  | 'authorized'
  | 'paid'
  | 'failed'
  | 'cod_pending'
  | 'cod_collected'
  | 'partially_refunded'
  | 'refunded';

export type ShipmentStatus =
  | 'pending'
  | 'manifested'
  | 'picked_up'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'rto_in_transit'
  | 'returned_to_origin'
  | 'failed';

export type ReturnStatus =
  | 'none'
  | 'requested'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'pickup_scheduled'
  | 'in_transit'
  | 'received'
  | 'inspected'
  | 'refund_approved'
  | 'refund_processed'
  | 'closed';

export interface OrderItemSnapshot {
  productId: string;
  name: string;
  thumbnail: string;
  sku?: string;
  quantity: number;
  selectedAttributes: { attributeId: string; attributeValue: string }[];
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
}

export interface OrderActivityEvent {
  id: string;
  orderId: string;
  eventType: string;
  previousStatus?: string;
  newStatus?: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  internalNote?: string;
  customerNote?: string;
  trackingNumber?: string;
}

export interface ShipmentDetails {
  id: string;
  orderId: string;
  courier: 'Delhivery' | 'Blue Dart' | 'DTDC' | 'India Post' | 'Shiprocket' | 'Custom Express';
  awbNumber: string;
  trackingUrl?: string;
  pickupDate?: string;
  dispatchDate?: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  weightGrams?: number;
  dimensionsCm?: { length: number; width: number; height: number };
  status: ShipmentStatus;
  notes?: string;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  reason: string;
  customerComments?: string;
  status: ReturnStatus;
  requestedAt: string;
  inspectedAt?: string;
  restockDecision?: 'restock' | 'damaged' | 'discard';
  refundAmount?: number;
}

export interface PersistentOrder {
  id: string; // Internal unique ID
  orderReference: string; // Customer-facing code, e.g. ELAN-2026-9921
  trackingToken: string; // Secure token for guest customer order tracking
  customerId?: string;
  customer: OrderCustomerInfo;
  shippingAddress: OrderShippingAddress;
  billingAddress?: OrderShippingAddress;
  items: OrderItemSnapshot[];
  currencySymbol: string;
  currencyCode: string;
  subtotal: number;
  discount: number;
  taxes: number;
  shippingCharge: number;
  grandTotal: number;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod';
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  fulfillmentStatus: FulfillmentStatus;
  shipmentStatus: ShipmentStatus;
  returnStatus: ReturnStatus;
  assignedStaff?: { id: string; name: string };
  shipment?: ShipmentDetails;
  events: OrderActivityEvent[];
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  isDemo: boolean;
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  variantKey?: string; // e.g. "M-Black"
  availableStock: number;
  reservedStock: number;
  lowStockThreshold: number;
  lastUpdated: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount: number;
  isActive: boolean;
  displayOrder: number;
}

export interface CouponItem {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}

export interface StorefrontCMSContent {
  brandName: string;
  tagline: string;
  announcementText: string;
  announcementEnabled: boolean;
  heroHeadline: string;
  heroSubheadline: string;
  heroImage: string;
  heroCtaText: string;
  heroCtaLink: string;
  address: string;
  email: string;
  phone: string;
  whatsapp: string;
  updatedAt: string;
}
