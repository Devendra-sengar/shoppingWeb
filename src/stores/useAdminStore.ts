import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  PersistentOrder,
  FulfillmentStatus,
  PaymentStatus,
  ShipmentStatus,
  OrderActivityEvent,
  ShipmentDetails,
  InventoryItem,
  ReturnRequest,
  CategoryItem,
  CouponItem,
  StorefrontCMSContent,
} from '../types/admin';
import type { Product } from '../types';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { saveOrderToFirestore, updateOrderInFirestore, getOrdersFromFirestore } from '../services/firebase/orderService';

// Seed Initial Orders for Demonstration
const INITIAL_ORDERS: PersistentOrder[] = [
  {
    id: 'ord_1001',
    orderReference: 'ELAN-FYA16D-9997',
    trackingToken: 'trk_9997_sec',
    customer: {
      firstName: 'Devendra',
      lastName: 'Sengar',
      email: 'devendrasengar8989@gmail.com',
      phone: '08319251059',
    },
    shippingAddress: {
      street: '46, Jai Ambe Nagar, Sukhlia',
      city: 'Indore',
      state: 'Madhya Pradesh',
      postalCode: '452010',
      country: 'India',
    },
    items: [
      {
        productId: 'elan-dress-01',
        name: 'Seraphina Pleated Maxi Gown',
        thumbnail: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
        sku: 'ELAN-DR-001',
        quantity: 1,
        selectedAttributes: [{ attributeId: 'Size', attributeValue: 'M' }],
        unitPrice: 39500,
        discount: 0,
        tax: 8295,
        total: 47795,
      },
    ],
    currencySymbol: '₹',
    currencyCode: 'INR',
    subtotal: 39500,
    discount: 0,
    taxes: 8295,
    shippingCharge: 0,
    grandTotal: 47795,
    paymentMethod: 'cod',
    paymentStatus: 'cod_pending',
    paymentReference: 'COD-VERIFIED-9997',
    fulfillmentStatus: 'ready_for_dispatch',
    shipmentStatus: 'manifested',
    returnStatus: 'none',
    assignedStaff: { id: 'admin_fulfillment', name: 'Dispatch Manager' },
    shipment: {
      id: 'ship_1001',
      orderId: 'ord_1001',
      courier: 'Delhivery',
      awbNumber: 'DEL-IND-99382104',
      trackingUrl: 'https://www.delhivery.com/track/package/DEL-IND-99382104',
      pickupDate: '2026-11-25T14:30:00Z',
      estimatedDeliveryDate: '2026-11-28T18:00:00Z',
      weightGrams: 850,
      status: 'manifested',
      notes: 'Fragile luxury garment packaging with branded box',
    },
    events: [
      {
        id: 'evt_1',
        orderId: 'ord_1001',
        eventType: 'order_received',
        newStatus: 'received',
        timestamp: '2026-11-25T14:00:00Z',
        actorId: 'system',
        actorName: 'Storefront Checkout',
        actorRole: 'Customer',
        internalNote: 'Order submitted with Cash on Delivery payment option',
        customerNote: 'Your order was successfully placed at ÉLAN Atelier.',
      },
      {
        id: 'evt_2',
        orderId: 'ord_1001',
        eventType: 'order_confirmed',
        previousStatus: 'received',
        newStatus: 'confirmed',
        timestamp: '2026-11-25T14:05:00Z',
        actorId: 'admin_owner',
        actorName: 'Atelier Director',
        actorRole: 'Super Admin',
        internalNote: 'Address and mobile contact 08319251059 verified via WhatsApp concierge',
        customerNote: 'Order confirmed and sent to tailoring department for inspection.',
      },
      {
        id: 'evt_3',
        orderId: 'ord_1001',
        eventType: 'order_packed',
        previousStatus: 'confirmed',
        newStatus: 'packed',
        timestamp: '2026-11-25T14:20:00Z',
        actorId: 'admin_fulfillment',
        actorName: 'Dispatch Manager',
        actorRole: 'Fulfillment Staff',
        internalNote: 'Garment steamed, QC passed, placed in ÉLAN cotton garment bag',
        customerNote: 'Your garment has been packed with utmost care.',
      },
      {
        id: 'evt_4',
        orderId: 'ord_1001',
        eventType: 'shipment_manifested',
        previousStatus: 'packed',
        newStatus: 'ready_for_dispatch',
        timestamp: '2026-11-25T14:30:00Z',
        actorId: 'admin_fulfillment',
        actorName: 'Dispatch Manager',
        actorRole: 'Fulfillment Staff',
        trackingNumber: 'DEL-IND-99382104',
        internalNote: 'Assigned to Delhivery Surface Express pickup from Vijay Nagar hub',
        customerNote: 'Shipment label generated with AWB DEL-IND-99382104.',
      },
    ],
    createdAt: '2026-11-25T14:00:00Z',
    updatedAt: '2026-11-25T14:30:00Z',
    isDemo: false,
  },
  {
    id: 'ord_1002',
    orderReference: 'ELAN-M8B22L-4102',
    trackingToken: 'trk_4102_sec',
    customer: {
      firstName: 'Priya',
      lastName: 'Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91 98260 12345',
    },
    shippingAddress: {
      street: '12, South Tukoganj',
      city: 'Indore',
      state: 'Madhya Pradesh',
      postalCode: '452001',
      country: 'India',
    },
    items: [
      {
        productId: 'elan-blouse-01',
        name: 'Aurelia Draped Silk Blouse',
        thumbnail: 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=800&q=80',
        sku: 'ELAN-BL-001',
        quantity: 1,
        selectedAttributes: [{ attributeId: 'Size', attributeValue: 'S' }],
        unitPrice: 24500,
        discount: 0,
        tax: 5145,
        total: 29645,
      },
    ],
    currencySymbol: '₹',
    currencyCode: 'INR',
    subtotal: 24500,
    discount: 0,
    taxes: 5145,
    shippingCharge: 0,
    grandTotal: 29645,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    paymentReference: 'UPI-RAZORPAY-PAY-98124',
    fulfillmentStatus: 'delivered',
    shipmentStatus: 'delivered',
    returnStatus: 'none',
    assignedStaff: { id: 'admin_fulfillment', name: 'Dispatch Manager' },
    shipment: {
      id: 'ship_1002',
      orderId: 'ord_1002',
      courier: 'Blue Dart',
      awbNumber: 'BD-IND-8821903',
      trackingUrl: 'https://www.bluedart.com/tracking?awb=BD-IND-8821903',
      pickupDate: '2026-11-23T11:00:00Z',
      dispatchDate: '2026-11-23T16:00:00Z',
      estimatedDeliveryDate: '2026-11-24T18:00:00Z',
      actualDeliveryDate: '2026-11-24T17:15:00Z',
      status: 'delivered',
      notes: 'Delivered to recipient with digital signature confirmation',
    },
    events: [
      {
        id: 'evt_201',
        orderId: 'ord_1002',
        eventType: 'order_received',
        newStatus: 'received',
        timestamp: '2026-11-23T10:00:00Z',
        actorId: 'system',
        actorName: 'Storefront',
        actorRole: 'Customer',
      },
      {
        id: 'evt_202',
        orderId: 'ord_1002',
        eventType: 'payment_verified',
        newStatus: 'confirmed',
        timestamp: '2026-11-23T10:02:00Z',
        actorId: 'system',
        actorName: 'UPI Gateway',
        actorRole: 'Payment Provider',
        customerNote: 'Payment verified successfully.',
      },
      {
        id: 'evt_203',
        orderId: 'ord_1002',
        eventType: 'dispatched',
        newStatus: 'dispatched',
        timestamp: '2026-11-23T16:00:00Z',
        actorId: 'admin_fulfillment',
        actorName: 'Dispatch Manager',
        actorRole: 'Fulfillment Staff',
        trackingNumber: 'BD-IND-8821903',
        customerNote: 'Dispatched with Blue Dart Air Express.',
      },
      {
        id: 'evt_204',
        orderId: 'ord_1002',
        eventType: 'delivered',
        newStatus: 'delivered',
        timestamp: '2026-11-24T17:15:00Z',
        actorId: 'admin_fulfillment',
        actorName: 'Courier Partner',
        actorRole: 'Courier',
        customerNote: 'Package delivered successfully.',
      },
    ],
    createdAt: '2026-11-23T10:00:00Z',
    updatedAt: '2026-11-24T17:15:00Z',
    isDemo: false,
  },
];

// Seed Inventory Items
const INITIAL_INVENTORY: InventoryItem[] = MOCK_PRODUCTS.map((prod: Product, index: number) => ({
  id: `inv_${prod.id}`,
  productId: prod.id,
  productName: prod.name,
  sku: `ELAN-${prod.category.toUpperCase().slice(0, 2)}-00${index + 1}`,
  availableStock: 12 + ((index * 3) % 25),
  reservedStock: index === 0 ? 1 : 0,
  lowStockThreshold: 5,
  lastUpdated: new Date().toISOString(),
}));

// Seed Categories
const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: 'cat_dresses', name: 'Dresses', slug: 'dresses', description: 'Editorial evening and daytime luxury dresses', productCount: 6, isActive: true, displayOrder: 1 },
  { id: 'cat_blouses', name: 'Blouses', slug: 'blouses', description: 'Pure silk tailoring and delicate tops', productCount: 5, isActive: true, displayOrder: 2 },
  { id: 'cat_jeans', name: 'Denim & Jeans', slug: 'jeans', description: 'Premium Japanese selvedge denim', productCount: 5, isActive: true, displayOrder: 3 },
  { id: 'cat_shoes', name: 'Shoes & Footwear', slug: 'shoes', description: 'Handcrafted Tuscan leather footwear', productCount: 6, isActive: true, displayOrder: 4 },
];

// Seed Coupons
const INITIAL_COUPONS: CouponItem[] = [
  { id: 'cpn_1', code: 'ELAN10', type: 'percentage', value: 10, minOrderValue: 20000, maxDiscount: 5000, usageLimit: 100, usedCount: 14, validFrom: '2026-01-01', validUntil: '2026-12-31', isActive: true },
  { id: 'cpn_2', code: 'WELCOME5000', type: 'fixed', value: 5000, minOrderValue: 40000, usageLimit: 50, usedCount: 8, validFrom: '2026-01-01', validUntil: '2026-12-31', isActive: true },
];

const INITIAL_CMS: StorefrontCMSContent = {
  brandName: 'ÉLAN',
  tagline: 'Everyday Elegance',
  announcementText: 'Complimentary express shipping across India & Worldwide • Demonstration Store',
  announcementEnabled: true,
  heroHeadline: 'Everyday Elegance',
  heroSubheadline: 'Masterfully tailored silhouettes in pure mulberry silk, Japanese denim, and Tuscan leather. Designed to endure seasons, not trends.',
  heroImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85',
  heroCtaText: 'Explore Collection',
  heroCtaLink: '/collections',
  address: 'ÉLAN Flagship Atelier, Vijay Nagar, Indore, Madhya Pradesh 452010',
  email: 'concierge@elan-fashion.demo',
  phone: '+91 9131494302',
  whatsapp: '919131494302',
  updatedAt: new Date().toISOString(),
};

interface AdminStoreState {
  orders: PersistentOrder[];
  inventory: InventoryItem[];
  categories: CategoryItem[];
  coupons: CouponItem[];
  returns: ReturnRequest[];
  cmsContent: StorefrontCMSContent;

  // Order actions
  createOrder: (order: Omit<PersistentOrder, 'id' | 'events' | 'createdAt' | 'updatedAt'>) => PersistentOrder;
  updateOrderStatus: (
    orderId: string,
    status: FulfillmentStatus,
    actor: { id: string; name: string; role: string },
    notes?: { internal?: string; customer?: string }
  ) => void;
  updatePaymentStatus: (orderId: string, status: PaymentStatus, reference?: string) => void;
  assignShipment: (orderId: string, shipment: Omit<ShipmentDetails, 'id' | 'orderId'>) => void;
  updateShipmentStatus: (orderId: string, status: ShipmentStatus, note?: string) => void;
  cancelOrder: (orderId: string, reason: string, actor: { id: string; name: string; role: string }) => void;
  getOrderById: (orderId: string) => PersistentOrder | undefined;
  getOrderByReference: (reference: string) => PersistentOrder | undefined;

  // Inventory actions
  adjustStock: (inventoryId: string, delta: number, reason: string) => void;

  // Category & CMS actions
  updateCategory: (categoryId: string, updates: Partial<CategoryItem>) => void;
  updateCMS: (updates: Partial<StorefrontCMSContent>) => void;
  loadOrdersFromCloud: () => Promise<void>;
}

export const useAdminStore = create<AdminStoreState>()(
  persist(
    (set, get) => ({
      orders: INITIAL_ORDERS,
      inventory: INITIAL_INVENTORY,
      categories: INITIAL_CATEGORIES,
      coupons: INITIAL_COUPONS,
      returns: [],
      cmsContent: INITIAL_CMS,

      createOrder: (orderData) => {
        const id = `ord_${Date.now()}`;
        const timestamp = new Date().toISOString();
        const initialEvent: OrderActivityEvent = {
          id: `evt_${Date.now()}`,
          orderId: id,
          eventType: 'order_received',
          newStatus: orderData.fulfillmentStatus,
          timestamp,
          actorId: 'storefront_client',
          actorName: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
          actorRole: 'Customer',
          customerNote: 'Order recorded in ÉLAN Atelier system.',
        };

        const newOrder: PersistentOrder = {
          ...orderData,
          id,
          events: [initialEvent],
          createdAt: timestamp,
          updatedAt: timestamp,
        };

        // Deduct inventory
        set((state) => {
          const updatedInventory = state.inventory.map((inv) => {
            const matchedItem = orderData.items.find((i) => i.productId === inv.productId);
            if (matchedItem) {
              return {
                ...inv,
                availableStock: Math.max(0, inv.availableStock - matchedItem.quantity),
                reservedStock: inv.reservedStock + matchedItem.quantity,
                lastUpdated: timestamp,
              };
            }
            return inv;
          });

          return {
            orders: [newOrder, ...state.orders],
            inventory: updatedInventory,
          };
        });

        // Asynchronously sync to Cloud Firestore
        saveOrderToFirestore(newOrder);

        return newOrder;
      },

      updateOrderStatus: (orderId, newStatus, actor, notes) => {
        const timestamp = new Date().toISOString();
        let updatedOrderSnapshot: PersistentOrder | undefined;

        set((state) => ({
          orders: state.orders.map((ord) => {
            if (ord.id !== orderId) return ord;
            const newEvent: OrderActivityEvent = {
              id: `evt_${Date.now()}`,
              orderId,
              eventType: `status_change_to_${newStatus}`,
              previousStatus: ord.fulfillmentStatus,
              newStatus,
              timestamp,
              actorId: actor.id,
              actorName: actor.name,
              actorRole: actor.role,
              internalNote: notes?.internal,
              customerNote: notes?.customer || `Order status updated to ${newStatus.replace(/_/g, ' ')}.`,
            };

            const updated: PersistentOrder = {
              ...ord,
              fulfillmentStatus: newStatus,
              updatedAt: timestamp,
              events: [newEvent, ...ord.events],
            };
            updatedOrderSnapshot = updated;
            return updated;
          }),
        }));

        if (updatedOrderSnapshot) {
          updateOrderInFirestore(orderId, updatedOrderSnapshot);
        }
      },

      updatePaymentStatus: (orderId, status, reference) => {
        const timestamp = new Date().toISOString();
        set((state) => ({
          orders: state.orders.map((ord) => {
            if (ord.id !== orderId) return ord;
            return {
              ...ord,
              paymentStatus: status,
              paymentReference: reference || ord.paymentReference,
              updatedAt: timestamp,
            };
          }),
        }));
      },

      assignShipment: (orderId, shipmentData) => {
        const timestamp = new Date().toISOString();
        const shipId = `ship_${Date.now()}`;
        const newShipment: ShipmentDetails = {
          ...shipmentData,
          id: shipId,
          orderId,
        };

        set((state) => ({
          orders: state.orders.map((ord) => {
            if (ord.id !== orderId) return ord;
            const newEvent: OrderActivityEvent = {
              id: `evt_${Date.now()}`,
              orderId,
              eventType: 'shipment_assigned',
              timestamp,
              actorId: 'admin_fulfillment',
              actorName: 'Fulfillment Staff',
              actorRole: 'Fulfillment',
              trackingNumber: shipmentData.awbNumber,
              customerNote: `Shipped with ${shipmentData.courier}. Tracking AWB: ${shipmentData.awbNumber}`,
            };

            return {
              ...ord,
              shipment: newShipment,
              shipmentStatus: shipmentData.status,
              fulfillmentStatus: 'ready_for_dispatch',
              updatedAt: timestamp,
              events: [newEvent, ...ord.events],
            };
          }),
        }));
      },

      updateShipmentStatus: (orderId, status, note) => {
        const timestamp = new Date().toISOString();
        set((state) => ({
          orders: state.orders.map((ord) => {
            if (ord.id !== orderId) return ord;
            const updatedShipment = ord.shipment ? { ...ord.shipment, status } : undefined;
            const mappedFulfillment: FulfillmentStatus = 
              status === 'delivered' ? 'delivered' :
              status === 'in_transit' ? 'in_transit' :
              status === 'out_for_delivery' ? 'out_for_delivery' :
              ord.fulfillmentStatus;

            const newEvent: OrderActivityEvent = {
              id: `evt_${Date.now()}`,
              orderId,
              eventType: `shipment_${status}`,
              timestamp,
              actorId: 'courier_partner',
              actorName: ord.shipment?.courier || 'Courier',
              actorRole: 'Courier',
              customerNote: note || `Shipment status is now ${status.replace(/_/g, ' ')}.`,
            };

            return {
              ...ord,
              shipment: updatedShipment,
              shipmentStatus: status,
              fulfillmentStatus: mappedFulfillment,
              updatedAt: timestamp,
              events: [newEvent, ...ord.events],
            };
          }),
        }));
      },

      cancelOrder: (orderId, reason, actor) => {
        const timestamp = new Date().toISOString();
        set((state) => {
          const target = state.orders.find((o) => o.id === orderId);
          // Release reserved inventory back
          const updatedInventory = state.inventory.map((inv) => {
            const matchedItem = target?.items.find((i) => i.productId === inv.productId);
            if (matchedItem) {
              return {
                ...inv,
                availableStock: inv.availableStock + matchedItem.quantity,
                reservedStock: Math.max(0, inv.reservedStock - matchedItem.quantity),
                lastUpdated: timestamp,
              };
            }
            return inv;
          });

          return {
            inventory: updatedInventory,
            orders: state.orders.map((ord) => {
              if (ord.id !== orderId) return ord;
              const newEvent: OrderActivityEvent = {
                id: `evt_${Date.now()}`,
                orderId,
                eventType: 'order_cancelled',
                newStatus: 'cancelled',
                timestamp,
                actorId: actor.id,
                actorName: actor.name,
                actorRole: actor.role,
                internalNote: `Cancellation reason: ${reason}`,
                customerNote: `This order was cancelled. Reason: ${reason}`,
              };

              return {
                ...ord,
                fulfillmentStatus: 'cancelled',
                cancellationReason: reason,
                updatedAt: timestamp,
                events: [newEvent, ...ord.events],
              };
            }),
          };
        });
      },

      getOrderById: (orderId) => get().orders.find((o) => o.id === orderId),
      getOrderByReference: (ref) => get().orders.find((o) => o.orderReference.toLowerCase() === ref.toLowerCase()),

      adjustStock: (inventoryId, delta, _reason) => {
        const timestamp = new Date().toISOString();
        set((state) => ({
          inventory: state.inventory.map((inv) => {
            if (inv.id !== inventoryId) return inv;
            return {
              ...inv,
              availableStock: Math.max(0, inv.availableStock + delta),
              lastUpdated: timestamp,
            };
          }),
        }));
      },

      updateCategory: (categoryId, updates) => {
        set((state) => ({
          categories: state.categories.map((c) => (c.id === categoryId ? { ...c, ...updates } : c)),
        }));
      },

      updateCMS: (updates) => {
        set((state) => ({
          cmsContent: { ...state.cmsContent, ...updates, updatedAt: new Date().toISOString() },
        }));
      },

      loadOrdersFromCloud: async () => {
        const cloudOrders = await getOrdersFromFirestore();
        if (cloudOrders.length > 0) {
          set((state) => {
            // Merge cloud orders with local ones, preferring cloud order records
            const mergedMap = new Map<string, PersistentOrder>();
            state.orders.forEach((o) => mergedMap.set(o.id, o));
            cloudOrders.forEach((o) => mergedMap.set(o.id, o));
            const merged = Array.from(mergedMap.values()).sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            return { orders: merged };
          });
        }
      },
    }),
    {
      name: 'elan_admin_master_storage',
    }
  )
);
