import { collection, doc, setDoc, getDocs, updateDoc, query, orderBy } from 'firebase/firestore/lite';
import { db } from './firebase';
import type { PersistentOrder } from '../../types/admin';

const ORDERS_COLLECTION = 'orders';

/**
 * Pushes a newly placed order to Cloud Firestore
 */
export async function saveOrderToFirestore(order: PersistentOrder): Promise<boolean> {
  if (!db) {
    console.warn('[OrderService] Firestore not initialized, order saved to local persistence only.');
    return false;
  }

  try {
    const orderDocRef = doc(db, ORDERS_COLLECTION, order.id);
    await setDoc(orderDocRef, order);
    console.log(`[OrderService] Successfully saved order ${order.orderReference} (${order.id}) to Cloud Firestore.`);
    return true;
  } catch (error) {
    console.error(`[OrderService] Error writing order to Cloud Firestore:`, error);
    return false;
  }
}

/**
 * Updates an existing order in Cloud Firestore (status changes, shipment, etc.)
 */
export async function updateOrderInFirestore(orderId: string, updates: Partial<PersistentOrder>): Promise<boolean> {
  if (!db) return false;

  try {
    const orderDocRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderDocRef, updates as any);
    console.log(`[OrderService] Updated order ${orderId} in Cloud Firestore.`);
    return true;
  } catch (error) {
    console.error(`[OrderService] Error updating order in Cloud Firestore:`, error);
    return false;
  }
}

/**
 * Fetches all orders from Cloud Firestore, ordered by creation date
 */
export async function getOrdersFromFirestore(): Promise<PersistentOrder[]> {
  if (!db) return [];

  try {
    const ordersCol = collection(db, ORDERS_COLLECTION);
    const q = query(ordersCol, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map((docSnap) => docSnap.data() as PersistentOrder);
  } catch (error) {
    console.warn('[OrderService] Could not fetch orders from Cloud Firestore:', error);
    return [];
  }
}
