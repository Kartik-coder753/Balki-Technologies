import {
  initializeApp,
  getApps,
  cert,
  applicationDefault,
  type ServiceAccount
} from 'firebase-admin/app';
import { getFirestore, Firestore, FieldValue } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';
import type { Order, OrderRequest, PaymentTransaction, AppNotification } from '../types';

let cachedAdminDb: Firestore | null = null;
let adminInitAttempted = false;
let adminInitReason = 'not_initialized';

function loadFirebaseConfig(): { projectId: string; firestoreDatabaseId?: string } {
  try {
    const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
    if (fs.existsSync(configPath)) {
      const parsed = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return {
        projectId: process.env.FIREBASE_PROJECT_ID || parsed.projectId || 'gen-lang-client-0184886612',
        firestoreDatabaseId: process.env.FIREBASE_DATABASE_ID || parsed.firestoreDatabaseId
      };
    }
  } catch {
    // fallback below
  }
  return {
    projectId: process.env.FIREBASE_PROJECT_ID || 'gen-lang-client-0184886612',
    firestoreDatabaseId:
      process.env.FIREBASE_DATABASE_ID || 'ai-studio-balkitechnologie-18d8f381-5363-412d-b9cb-53b6b6bbba92'
  };
}

function parseServiceAccountFromEnv(): ServiceAccount | null {
  const rawJson = (process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '').trim();
  if (rawJson) {
    try {
      const decoded = rawJson.startsWith('{') ? rawJson : Buffer.from(rawJson, 'base64').toString('utf8');
      const parsed = JSON.parse(decoded);
      if (parsed.client_email && parsed.private_key) {
        return {
          projectId: parsed.project_id,
          clientEmail: parsed.client_email,
          privateKey: String(parsed.private_key).replace(/\\n/g, '\n')
        };
      }
    } catch (err) {
      console.warn('Invalid FIREBASE_SERVICE_ACCOUNT_JSON format:', err instanceof Error ? err.message : err);
    }
  }

  const clientEmail = (process.env.FIREBASE_CLIENT_EMAIL || '').trim();
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').trim();
  const projectId = (process.env.FIREBASE_PROJECT_ID || '').trim();
  if (clientEmail && privateKey) {
    return {
      projectId: projectId || loadFirebaseConfig().projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n')
    };
  }

  return null;
}

export function getAdminFirestore(): Firestore | null {
  if (cachedAdminDb) return cachedAdminDb;
  if (adminInitAttempted) return null;
  adminInitAttempted = true;

  const cfg = loadFirebaseConfig();
  const serviceAccount = parseServiceAccountFromEnv();

  // Only initialize Admin SDK when explicit service account credentials or GOOGLE_APPLICATION_CREDENTIALS are configured
  const hasExplicitCreds = Boolean(serviceAccount || process.env.GOOGLE_APPLICATION_CREDENTIALS);
  if (!hasExplicitCreds) {
    adminInitReason = 'no_admin_credentials_configured';
    return null;
  }

  try {
    const appName = 'balki-server-admin';
    const existingApp = getApps().find(a => a.name === appName);
    const firebaseApp =
      existingApp ||
      initializeApp(
        {
          credential: serviceAccount ? cert(serviceAccount) : applicationDefault(),
          projectId: serviceAccount?.projectId || cfg.projectId
        },
        appName
      );

    cachedAdminDb = cfg.firestoreDatabaseId
      ? getFirestore(firebaseApp, cfg.firestoreDatabaseId)
      : getFirestore(firebaseApp);
    adminInitReason = 'configured';
    return cachedAdminDb;
  } catch (err) {
    adminInitReason = err instanceof Error ? err.message : 'init_failed';
    console.warn('Firebase Admin initialization skipped:', adminInitReason);
    return null;
  }
}

export function getAdminFirestoreStatus(): { configured: boolean; reason: string } {
  getAdminFirestore();
  return {
    configured: Boolean(cachedAdminDb),
    reason: adminInitReason
  };
}

export async function syncOrderCreatedToFirestore(order: Order): Promise<boolean> {
  const db = getAdminFirestore();
  if (!db) return false;

  try {
    const orderRef = db.collection('orders').doc(order.id);
    await orderRef.set(
      {
        ...order,
        orderId: order.id,
        customerId: order.customerId || order.userId || 'client',
        userId: order.userId || order.customerId || 'client',
        serverVerifiedTotal: order.finalAmount ?? order.totalAmount,
        serverVerifiedTotalPaise: Math.round((order.finalAmount ?? order.totalAmount) * 100),
        currency: 'INR',
        razorpayOrderId: order.razorpayOrderId || null,
        razorpayPaymentId: order.razorpayPaymentId || null,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        approvalStatus: order.approvalStatus,
        confirmationNotificationSent: false,
        createdAt: order.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
    return true;
  } catch (err) {
    console.warn('Firestore Admin syncOrderCreated failed:', err instanceof Error ? err.message : err);
    return false;
  }
}

export async function syncRazorpayOrderIdToFirestore(orderId: string, razorpayOrderId: string): Promise<boolean> {
  const db = getAdminFirestore();
  if (!db) return false;

  try {
    await db.collection('orders').doc(orderId).set(
      {
        razorpayOrderId,
        paymentStatus: 'Payment Pending',
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
    return true;
  } catch (err) {
    console.warn('Firestore Admin syncRazorpayOrderId failed:', err instanceof Error ? err.message : err);
    return false;
  }
}

export async function syncOrderRequestToFirestore(request: OrderRequest): Promise<boolean> {
  const db = getAdminFirestore();
  if (!db) return false;

  try {
    await db.collection('orderRequests').doc(request.requestId).set(
      {
        ...request,
        serverVerifiedTotal: request.finalAmount ?? request.requestedAmount,
        serverVerifiedTotalPaise: Math.round((request.finalAmount ?? request.requestedAmount) * 100),
        currency: 'INR',
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
    return true;
  } catch (err) {
    console.warn('Firestore Admin syncOrderRequest failed:', err instanceof Error ? err.message : err);
    return false;
  }
}

export async function findFirestoreOrder(params: {
  orderId?: string | null;
  razorpayOrderId?: string | null;
}): Promise<Record<string, any> | null> {
  const db = getAdminFirestore();
  if (!db) return null;

  try {
    if (params.orderId) {
      const snap = await db.collection('orders').doc(params.orderId).get();
      if (snap.exists) {
        return { id: snap.id, ...snap.data() };
      }
    }
    if (params.razorpayOrderId) {
      const querySnap = await db
        .collection('orders')
        .where('razorpayOrderId', '==', params.razorpayOrderId)
        .limit(1)
        .get();
      if (!querySnap.empty) {
        const docSnap = querySnap.docs[0];
        return { id: docSnap.id, ...docSnap.data() };
      }
    }
    return null;
  } catch (err) {
    console.warn('Firestore Admin findFirestoreOrder failed:', err instanceof Error ? err.message : err);
    return null;
  }
}

export interface AtomicCaptureParams {
  orderId?: string | null;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature?: string | null;
  paymentMethod?: string | null;
  capturedAmountPaise?: number | null;
  currency?: string | null;
  eventId?: string | null;
  eventName?: string | null;
  source: 'checkout_verify' | 'webhook';
  fallbackOrderData?: Order | null;
}

export interface AtomicCaptureResult {
  handledByFirestore: boolean;
  duplicateEvent?: boolean;
  orderNotFound?: boolean;
  amountMismatch?: boolean;
  currencyMismatch?: boolean;
  alreadyPaidSamePayment?: boolean;
  conflictDuplicatePayment?: boolean;
  shouldSendConfirmation?: boolean;
  order?: Record<string, any>;
  transaction?: PaymentTransaction;
  notification?: AppNotification;
  expectedPaise?: number;
  actualPaise?: number;
}

export async function runAtomicCaptureTransaction(
  params: AtomicCaptureParams
): Promise<AtomicCaptureResult> {
  const db = getAdminFirestore();
  if (!db) {
    return { handledByFirestore: false };
  }

  try {
    return await db.runTransaction(async (tx) => {
      // 1. Atomic webhook-event idempotency check
      if (params.eventId) {
        const eventRef = db.collection('webhook-events').doc(params.eventId);
        const eventSnap = await tx.get(eventRef);
        if (eventSnap.exists) {
          return { handledByFirestore: true, duplicateEvent: true };
        }
      }

      // 2. Locate order in Firestore (by orderId or by razorpayOrderId query)
      let orderRef: FirebaseFirestore.DocumentReference | null = null;
      let orderSnap: FirebaseFirestore.DocumentSnapshot | null = null;

      if (params.orderId) {
        orderRef = db.collection('orders').doc(params.orderId);
        orderSnap = await tx.get(orderRef);
      }

      if ((!orderSnap || !orderSnap.exists) && params.razorpayOrderId) {
        const qSnap = await tx.get(
          db.collection('orders').where('razorpayOrderId', '==', params.razorpayOrderId).limit(1)
        );
        if (!qSnap.empty) {
          orderSnap = qSnap.docs[0];
          orderRef = orderSnap.ref;
        }
      }

      if (!orderSnap || !orderSnap.exists || !orderRef) {
        if (params.eventId) {
          tx.set(db.collection('webhook-events').doc(params.eventId), {
            eventId: params.eventId,
            eventName: params.eventName || 'payment.captured',
            razorpayOrderId: params.razorpayOrderId,
            razorpayPaymentId: params.razorpayPaymentId,
            status: 'ignored_order_not_found',
            processedAt: new Date().toISOString()
          });
        }
        return { handledByFirestore: true, orderNotFound: true };
      }

      const orderData = orderSnap.data() as Record<string, any>;
      const expectedTotal = Number(
        orderData.serverVerifiedTotal ?? orderData.finalAmount ?? orderData.totalAmount ?? 0
      );
      const expectedPaise = Math.round(expectedTotal * 100);

      // 3. Currency & amount check against authoritative server-side total
      if (params.currency && params.currency.toUpperCase() !== 'INR') {
        if (params.eventId) {
          tx.set(db.collection('webhook-events').doc(params.eventId), {
            eventId: params.eventId,
            eventName: params.eventName || 'payment.captured',
            orderId: orderRef.id,
            status: 'rejected_currency_mismatch',
            currency: params.currency,
            processedAt: new Date().toISOString()
          });
        }
        return { handledByFirestore: true, currencyMismatch: true };
      }

      if (typeof params.capturedAmountPaise === 'number' && params.capturedAmountPaise !== expectedPaise) {
        if (params.eventId) {
          tx.set(db.collection('webhook-events').doc(params.eventId), {
            eventId: params.eventId,
            eventName: params.eventName || 'payment.captured',
            orderId: orderRef.id,
            status: 'rejected_amount_mismatch',
            expectedPaise,
            actualPaise: params.capturedAmountPaise,
            processedAt: new Date().toISOString()
          });
        }
        return {
          handledByFirestore: true,
          amountMismatch: true,
          expectedPaise,
          actualPaise: params.capturedAmountPaise
        };
      }

      // 4. Duplicate payment guard
      if (orderData.paymentStatus === 'Paid') {
        if (orderData.razorpayPaymentId === params.razorpayPaymentId) {
          if (params.eventId) {
            tx.set(db.collection('webhook-events').doc(params.eventId), {
              eventId: params.eventId,
              eventName: params.eventName || 'payment.captured',
              orderId: orderRef.id,
              razorpayOrderId: params.razorpayOrderId,
              razorpayPaymentId: params.razorpayPaymentId,
              status: 'idempotent_already_paid',
              processedAt: new Date().toISOString()
            });
          }
          return {
            handledByFirestore: true,
            alreadyPaidSamePayment: true,
            shouldSendConfirmation: false,
            order: { id: orderRef.id, ...orderData }
          };
        }

        if (params.eventId) {
          tx.set(db.collection('webhook-events').doc(params.eventId), {
            eventId: params.eventId,
            eventName: params.eventName || 'payment.captured',
            orderId: orderRef.id,
            razorpayOrderId: params.razorpayOrderId,
            razorpayPaymentId: params.razorpayPaymentId,
            existingPaymentId: orderData.razorpayPaymentId,
            status: 'rejected_duplicate_payment',
            processedAt: new Date().toISOString()
          });
        }
        return { handledByFirestore: true, conflictDuplicatePayment: true, order: { id: orderRef.id, ...orderData } };
      }

      // 5. Commit verified Paid transition & audit records atomically
      const nowIso = new Date().toISOString();
      const shouldSendConfirmation = orderData.confirmationNotificationSent !== true;

      const updatedFields: Record<string, any> = {
        paymentStatus: 'Paid',
        orderStatus: orderData.orderStatus === 'delivered' ? 'delivered' : 'qc_assembly',
        razorpayOrderId: params.razorpayOrderId,
        razorpayPaymentId: params.razorpayPaymentId,
        paymentMethod: params.paymentMethod || orderData.paymentMethod || 'Razorpay',
        paidAt: nowIso,
        updatedAt: nowIso,
        confirmationNotificationSent: true
      };
      if (params.razorpaySignature) {
        updatedFields.razorpaySignature = params.razorpaySignature;
      }

      tx.update(orderRef, updatedFields);

      const txnId = `txn_${params.source}_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
      const txnRecord: PaymentTransaction = {
        transactionId: txnId,
        orderId: orderRef.id,
        customerId: orderData.customerId || orderData.userId || 'client',
        amount: expectedTotal,
        currency: 'INR',
        paymentMethod: params.paymentMethod || 'Razorpay',
        transactionType: 'payment',
        gatewayReference: params.razorpayPaymentId,
        status: 'SUCCESS',
        metadata: {
          source: params.source,
          razorpayOrderId: params.razorpayOrderId,
          razorpayPaymentId: params.razorpayPaymentId,
          eventId: params.eventId || null,
          verifiedAt: nowIso
        },
        createdAt: nowIso
      };
      tx.set(db.collection('paymentTransactions').doc(txnId), txnRecord);

      let notifRecord: AppNotification | undefined;
      if (shouldSendConfirmation) {
        const notifId = `notif_pay_${orderRef.id}_${params.razorpayPaymentId}`;
        notifRecord = {
          notificationId: notifId,
          recipientId: orderData.customerId || orderData.userId || 'client',
          recipientEmail: orderData.customerEmail,
          title: `Payment Confirmed: Order ${orderRef.id}`,
          message: `Your payment of INR ${expectedTotal.toLocaleString('en-IN')} has been verified via Razorpay (Txn: ${params.razorpayPaymentId}).`,
          type: 'order_status',
          orderId: orderRef.id,
          read: false,
          createdAt: nowIso
        };
        tx.set(db.collection('notifications').doc(notifId), notifRecord);
      }

      if (params.eventId) {
        tx.set(db.collection('webhook-events').doc(params.eventId), {
          eventId: params.eventId,
          eventName: params.eventName || 'payment.captured',
          orderId: orderRef.id,
          razorpayOrderId: params.razorpayOrderId,
          razorpayPaymentId: params.razorpayPaymentId,
          amountPaise: expectedPaise,
          currency: 'INR',
          status: 'processed_paid',
          processedAt: nowIso
        });
      }

      return {
        handledByFirestore: true,
        shouldSendConfirmation,
        order: { id: orderRef.id, ...orderData, ...updatedFields },
        transaction: txnRecord,
        notification: notifRecord
      };
    });
  } catch (err) {
    console.warn('Firestore runAtomicCaptureTransaction failed:', err instanceof Error ? err.message : err);
    return { handledByFirestore: false };
  }
}

export interface AtomicFailureParams {
  orderId?: string | null;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  errorCode?: string | null;
  errorDescription?: string | null;
  eventId?: string | null;
  eventName?: string | null;
}

export interface AtomicFailureResult {
  handledByFirestore: boolean;
  duplicateEvent?: boolean;
  orderNotFound?: boolean;
  ignoredAlreadyPaid?: boolean;
  order?: Record<string, any>;
}

export async function runAtomicFailureTransaction(
  params: AtomicFailureParams
): Promise<AtomicFailureResult> {
  const db = getAdminFirestore();
  if (!db) {
    return { handledByFirestore: false };
  }

  try {
    return await db.runTransaction(async (tx) => {
      if (params.eventId) {
        const eventRef = db.collection('webhook-events').doc(params.eventId);
        const eventSnap = await tx.get(eventRef);
        if (eventSnap.exists) {
          return { handledByFirestore: true, duplicateEvent: true };
        }
      }

      let orderRef: FirebaseFirestore.DocumentReference | null = null;
      let orderSnap: FirebaseFirestore.DocumentSnapshot | null = null;

      if (params.orderId) {
        orderRef = db.collection('orders').doc(params.orderId);
        orderSnap = await tx.get(orderRef);
      }

      if ((!orderSnap || !orderSnap.exists) && params.razorpayOrderId) {
        const qSnap = await tx.get(
          db.collection('orders').where('razorpayOrderId', '==', params.razorpayOrderId).limit(1)
        );
        if (!qSnap.empty) {
          orderSnap = qSnap.docs[0];
          orderRef = orderSnap.ref;
        }
      }

      const nowIso = new Date().toISOString();

      if (!orderSnap || !orderSnap.exists || !orderRef) {
        if (params.eventId) {
          tx.set(db.collection('webhook-events').doc(params.eventId), {
            eventId: params.eventId,
            eventName: params.eventName || 'payment.failed',
            razorpayOrderId: params.razorpayOrderId || null,
            razorpayPaymentId: params.razorpayPaymentId || null,
            status: 'ignored_order_not_found',
            processedAt: nowIso
          });
        }
        return { handledByFirestore: true, orderNotFound: true };
      }

      const orderData = orderSnap.data() as Record<string, any>;

      // Never downgrade an already captured / Paid order!
      if (orderData.paymentStatus === 'Paid') {
        if (params.eventId) {
          tx.set(db.collection('webhook-events').doc(params.eventId), {
            eventId: params.eventId,
            eventName: params.eventName || 'payment.failed',
            orderId: orderRef.id,
            razorpayOrderId: params.razorpayOrderId || null,
            razorpayPaymentId: params.razorpayPaymentId || null,
            status: 'ignored_already_paid',
            processedAt: nowIso
          });
        }
        return {
          handledByFirestore: true,
          ignoredAlreadyPaid: true,
          order: { id: orderRef.id, ...orderData }
        };
      }

      const failureEntry = {
        paymentId: params.razorpayPaymentId || null,
        errorCode: params.errorCode || 'PAYMENT_FAILED',
        description: params.errorDescription || 'Payment attempt failed at Razorpay gateway',
        timestamp: nowIso
      };

      tx.update(orderRef, {
        paymentStatus: 'Failed',
        lastPaymentError: failureEntry.description,
        failedPaymentAttempts: FieldValue.arrayUnion(failureEntry),
        updatedAt: nowIso
      });

      const txnId = `txn_fail_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
      tx.set(db.collection('paymentTransactions').doc(txnId), {
        transactionId: txnId,
        orderId: orderRef.id,
        customerId: orderData.customerId || orderData.userId || 'client',
        amount: Number(orderData.serverVerifiedTotal ?? orderData.finalAmount ?? orderData.totalAmount ?? 0),
        currency: 'INR',
        paymentMethod: 'Razorpay',
        transactionType: 'payment',
        gatewayReference: params.razorpayPaymentId || params.razorpayOrderId || txnId,
        status: 'FAILED',
        metadata: failureEntry,
        createdAt: nowIso
      });

      if (params.eventId) {
        tx.set(db.collection('webhook-events').doc(params.eventId), {
          eventId: params.eventId,
          eventName: params.eventName || 'payment.failed',
          orderId: orderRef.id,
          razorpayOrderId: params.razorpayOrderId || null,
          razorpayPaymentId: params.razorpayPaymentId || null,
          status: 'processed_failed',
          processedAt: nowIso
        });
      }

      return {
        handledByFirestore: true,
        order: { id: orderRef.id, ...orderData, paymentStatus: 'Failed', lastPaymentError: failureEntry.description }
      };
    });
  } catch (err) {
    console.warn('Firestore runAtomicFailureTransaction failed:', err instanceof Error ? err.message : err);
    return { handledByFirestore: false };
  }
}

export async function recordEmailAuditInFirestore(mailDoc: {
  id: string;
  to: string;
  subject: string;
  orderId: string;
  paymentId?: string;
  amountInr: number;
  paymentStatus: string;
  deliveryProvider: string;
  delivered: boolean;
  html: string;
  createdAt: string;
}): Promise<void> {
  const db = getAdminFirestore();
  if (!db) return;
  try {
    await db.collection('mail').doc(mailDoc.id).set(mailDoc, { merge: true });
  } catch (err) {
    console.warn('Firestore mail audit write skipped:', err instanceof Error ? err.message : err);
  }
}
