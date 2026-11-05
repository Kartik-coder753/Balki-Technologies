# Security Specification & Threat Model
## Balki Technologies E-Commerce Platform

### 1. Data Invariants
1. **Order Identity & Integrity**: An order's `customerId` (or `userId`) must strictly match the authenticated user's `request.auth.uid`. A customer cannot create an order in the name of another user.
2. **State & Pricing Tamper Resistance**: Customers cannot set or modify `approvalStatus`, `paymentStatus`, `orderStatus`, `finalAmount`, `totalAmount`, `subtotal`, `shippingCharges`, or `taxAmount`. All state transitions and price authorizations are strictly reserved for server-side endpoints and authorized administrators.
3. **Role & Privilege Escalation Prevention**: Clients cannot assign or elevate administrative privileges (`adminUsers` collection is locked to existing admins, and user profile `role` cannot be self-promoted to Admin).
4. **PII and Data Isolation**: Customer order records, order requests, and private profile information can only be read by the document owner or an authorized administrator. Blanket listing of arbitrary users' orders is blocked.
5. **Payment Audit Immutability**: `paymentTransactions` records can only be created and audited by authorized backend services or administrators; customer client write access is denied.
6. **Notification Privacy**: User notifications can only be read by the designated `recipientId` or an admin. Customers may only update the `read: true` flag on their own notifications.
7. **Temporal Consistency**: Timestamps (`createdAt`, `updatedAt`) must adhere to server time integrity.

---

### 2. The "Dirty Dozen" Threat Payloads

| ID | Attack Vector | Malicious Payload Concept | Expected Result |
|----|---------------|---------------------------|-----------------|
| T1 | **Identity Spoofing on Order Creation** | `{ orderId: "ORD-1", customerId: "VICTIM_UID", ... }` where `auth.uid == "ATTACKER_UID"` | `PERMISSION_DENIED` |
| T2 | **Price Manipulation / Zero-Cost Checkout** | `{ finalAmount: 0, subtotal: 0, items: [{ price: 95000, qty: 1 }] }` bypassing backend calculate | `PERMISSION_DENIED` (client-side price tampering blocked) |
| T3 | **Self-Approval Exploit** | `{ orderId: "ORD-1", approvalStatus: "approved", paymentStatus: "Paid" }` submitted by customer | `PERMISSION_DENIED` (must be `pending_approval`) |
| T4 | **Delivery Status Forgery** | `updateDoc(orderRef, { orderStatus: "delivered" })` sent from customer client | `PERMISSION_DENIED` (state updates restricted to admin/server) |
| T5 | **Admin Privilege Self-Grant** | `setDoc(doc(db, "adminUsers", attackerUid), { role: "super_admin" })` | `PERMISSION_DENIED` (only existing admin can write) |
| T6 | **Order List Scraping** | `getDocs(collection(db, "orders"))` without `customerId == auth.uid` constraint | `PERMISSION_DENIED` (blanket reads prohibited) |
| T7 | **Payment Transaction Fabrication** | `addDoc(collection(db, "paymentTransactions"), { status: "SUCCESS", amount: 100000 })` | `PERMISSION_DENIED` (client write disabled) |
| T8 | **PII Exfiltration** | `getDoc(doc(db, "users", "OTHER_USER_UID"))` by unprivileged user | `PERMISSION_DENIED` |
| T9 | **Order Request Price Override** | `updateDoc(requestRef, { finalQuotedAmount: 1, approvalStatus: "approved" })` | `PERMISSION_DENIED` |
| T10| **Email Spoofing Admin Attack** | Request with token email `kartikks1205@gmail.com` but `email_verified == false` | `PERMISSION_DENIED` |
| T11| **Junk ID / Resource Exhaustion** | Write with document ID consisting of 2,000 junk characters | `PERMISSION_DENIED` (`isValidId` enforces regex & size <= 128) |
| T12| **Notification Cross-Account Read** | `getDoc(doc(db, "notifications", "VICTIM_NOTE_ID"))` by another user | `PERMISSION_DENIED` |

---

### 3. Test Runner
Refer to `tests/firestore.rules.test.ts` for automated verification of rule definitions.
