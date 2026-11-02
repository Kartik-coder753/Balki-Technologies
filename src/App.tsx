import React, { useState, useEffect } from 'react';
import { 
  Product, 
  Course, 
  RentalEquipment, 
  CartItem, 
  Order, 
  RentalBooking, 
  InventoryItem, 
  UserProgress,
  ClientReview,
  CaseStudyBlog,
  SupportTicket,
  ProductCategory,
  NavTab
} from './types';
import { initialProducts, initialCourses, initialRentals, initialInventory, initialUserProgress, initialOrders } from './data/initialData';
import { initialClientReviews, initialCaseStudyBlogs } from './data/blogAndReviewsData';
import { INITIAL_SUPPORT_TICKETS } from './data/supportData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { StoreSection } from './components/StoreSection';
import { QuotationsSection } from './components/QuotationsSection';
import { CoursesSection } from './components/CoursesSection';
import { RentalsSection } from './components/RentalsSection';
import { InventoryManager } from './components/InventoryManager';
import { StudentDashboard } from './components/StudentDashboard';
import { CareersSection } from './components/CareersSection';
import { ContactSupportSection } from './components/ContactSupportSection';
import { AboutUsSection } from './components/AboutUsSection';
import { BlogSection } from './components/BlogSection';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { B2BPortalModal } from './components/B2BPortalModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [storeCategory, setStoreCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Domain Entities State
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [rentals, setRentals] = useState<RentalEquipment[]>(initialRentals);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [userProgress, setUserProgress] = useState<UserProgress>(initialUserProgress);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [rentalBookings, setRentalBookings] = useState<RentalBooking[]>([]);
  const [reviews, setReviews] = useState<ClientReview[]>(initialClientReviews);
  const [caseStudies, setCaseStudies] = useState<CaseStudyBlog[]>(initialCaseStudyBlogs);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(INITIAL_SUPPORT_TICKETS);

  // Cart, Tracking & Modals
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isB2BOpen, setIsB2BOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingTargetId, setTrackingTargetId] = useState('');

  const handleOpenTracking = (orderOrId?: Order | string) => {
    if (typeof orderOrId === 'string') {
      setTrackingTargetId(orderOrId);
    } else if (orderOrId && typeof orderOrId === 'object') {
      setTrackingTargetId(orderOrId.id || orderOrId.trackingNumber);
    } else if (orders.length > 0) {
      setTrackingTargetId(orders[0].id);
    } else {
      setTrackingTargetId('ORD-2026-9081');
    }
    setIsTrackingOpen(true);
  };

  // Initial Fetch from backend APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, courseRes, rentRes, invRes, progRes, ordRes, revRes, caseRes, tktRes] = await Promise.all([
          fetch('/api/products').catch(() => null),
          fetch('/api/courses').catch(() => null),
          fetch('/api/rentals').catch(() => null),
          fetch('/api/inventory').catch(() => null),
          fetch('/api/user/progress').catch(() => null),
          fetch('/api/orders').catch(() => null),
          fetch('/api/reviews').catch(() => null),
          fetch('/api/case-studies').catch(() => null),
          fetch('/api/support/tickets').catch(() => null)
        ]);

        if (prodRes && prodRes.ok) setProducts(await prodRes.json());
        if (courseRes && courseRes.ok) setCourses(await courseRes.json());
        if (rentRes && rentRes.ok) setRentals(await rentRes.json());
        if (invRes && invRes.ok) setInventory(await invRes.json());
        if (progRes && progRes.ok) setUserProgress(await progRes.json());
        if (ordRes && ordRes.ok) setOrders(await ordRes.json());
        if (revRes && revRes.ok) setReviews(await revRes.json());
        if (caseRes && caseRes.ok) setCaseStudies(await caseRes.json());
        if (tktRes && tktRes.ok) setSupportTickets(await tktRes.json());
      } catch (e) {
        console.warn('Backend loading in-memory initial fallback', e);
      }
    };
    fetchData();
  }, []);


  // Cart Handlers
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleBuyNow = (product: Product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleApplyCoupon = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'ATL2026') {
      setCouponDiscount(500);
      setAppliedCoupon('ATL2026');
      return true;
    } else if (clean === 'NEP20') {
      const subtotal = cartItems.reduce((sum, it) => sum + it.product.price * it.quantity, 0);
      setCouponDiscount(Math.round(subtotal * 0.20));
      setAppliedCoupon('NEP20');
      return true;
    } else if (clean === 'FREESHIP') {
      setCouponDiscount(150);
      setAppliedCoupon('FREESHIP');
      return true;
    }
    return false;
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  // Complete Order
  const handleOrderSuccess = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    setCartItems([]);
    setCouponDiscount(0);
    setAppliedCoupon('');
    // Update local products & inventory stock
    setProducts(prev =>
      prev.map(prod => {
        const matchingItem = order.items.find(i => i.product.sku === prod.sku || i.product.id === prod.id);
        if (matchingItem) {
          return { ...prod, stock: Math.max(0, prod.stock - matchingItem.quantity) };
        }
        return prod;
      })
    );
    setInventory(prev =>
      prev.map(inv => {
        const matchingItem = order.items.find(i => i.product.sku === inv.sku);
        if (matchingItem) {
          const newStock = Math.max(0, inv.currentStock - matchingItem.quantity);
          return {
            ...inv,
            currentStock: newStock,
            status: newStock <= 5 ? 'Critical' : newStock <= inv.minimumThreshold ? 'Low Stock' : 'In Stock'
          };
        }
        return inv;
      })
    );
  };

  // Complete Rental
  const handleRentalSuccess = (booking: RentalBooking) => {
    setRentalBookings(prev => [booking, ...prev]);
    setRentals(prev =>
      prev.map(r =>
        r.id === booking.equipmentId
          ? { ...r, availableUnits: Math.max(0, r.availableUnits - 1) }
          : r
      )
    );
  };

  // Complete Lesson & Quiz
  const handleCompleteLesson = async (
    lessonId: string, 
    quizScore: number, 
    courseId: string, 
    courseTitle: string
  ) => {
    try {
      const res = await fetch('/api/user/progress/complete-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, quizScore, courseId, courseTitle })
      });
      if (res.ok) {
        const updated: UserProgress = await res.json();
        setUserProgress(updated);
      } else {
        setUserProgress(prev => {
          const completed = Array.from(new Set([...prev.completedLessonIds, lessonId]));
          return {
            ...prev,
            completedLessonIds: completed,
            tinkeringHours: prev.tinkeringHours + 1.5,
            quizScores: { ...prev.quizScores, [lessonId]: quizScore }
          };
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Inventory Update
  const handleUpdateStock = async (
    sku: string, 
    deltaStock: number, 
    newMinThreshold?: number, 
    notes?: string
  ) => {
    const res = await fetch('/api/inventory/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sku, deltaStock, newMinThreshold, notes })
    });
    if (!res.ok) throw new Error('Inventory update failed');
    const data = await res.json();
    const updatedItem: InventoryItem = data.item || data;
    setInventory(prev => prev.map(item => item.sku === sku ? updatedItem : item));
    setProducts(prev => prev.map(p => p.sku === sku ? { ...p, stock: updatedItem.currentStock } : p));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-amber-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartItems={cartItems}
        setIsCartOpen={setIsCartOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        openB2BModal={() => setIsB2BOpen(true)}
        tinkeringHours={userProgress.tinkeringHours}
        products={products}
        courses={courses}
        rentals={rentals}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onSelectCategory={(cat) => {
          setStoreCategory(cat);
          setActiveTab('store');
        }}
        onOpenTracking={() => handleOpenTracking()}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {(activeTab === 'home' || activeTab === 'store') && (
          <StoreSection
            products={products}
            courses={courses}
            rentals={rentals}
            reviews={reviews}
            caseStudies={caseStudies}
            initialCategory={storeCategory}
            onAddToCart={handleAddToCart}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onBuyNow={handleBuyNow}
            searchQuery={searchQuery}
            openB2BModal={() => setIsB2BOpen(true)}
            setActiveTab={setActiveTab}
            onAddReview={(newRev) => {
              setReviews((prev) => [newRev, ...prev]);
              fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRev)
              }).catch((e) => console.warn('Saved in local state', e));
            }}
          />
        )}

        {activeTab === 'quotations' && (
          <QuotationsSection
            onAddToCart={handleAddToCart}
            openB2BModal={() => setIsB2BOpen(true)}
            setActiveTab={setActiveTab}
            onExploreCategory={(cat) => {
              setStoreCategory(cat);
              setActiveTab('store');
            }}
          />
        )}

        {activeTab === 'blog' && (
          <BlogSection
            caseStudies={caseStudies}
            products={products}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onAddToCart={handleAddToCart}
            onExploreShop={() => {
              setActiveTab('store');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'about' && (
          <AboutUsSection
            onExploreShop={() => {
              setActiveTab('store');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            openB2BModal={() => setIsB2BOpen(true)}
            onContactUs={() => {
              setActiveTab('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'courses' && (
          <CoursesSection
            courses={courses}
            userProgress={userProgress}
            onCompleteLesson={handleCompleteLesson}
          />
        )}

        {activeTab === 'rentals' && (
          <RentalsSection
            rentals={rentals}
            onBookingSuccess={handleRentalSuccess}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryManager
            inventory={inventory}
            onUpdateStock={handleUpdateStock}
          />
        )}

        {activeTab === 'dashboard' && (
          <StudentDashboard
            userProgress={userProgress}
            orders={orders}
            rentals={rentalBookings}
            courses={courses}
            setActiveTab={setActiveTab}
            onTrackOrder={(order) => handleOpenTracking(order)}
          />
        )}

        {activeTab === 'careers' && (
          <CareersSection />
        )}

        {activeTab === 'contact' && (
          <ContactSupportSection
            tickets={supportTickets}
            onAddTicket={(newTkt) => {
              setSupportTickets((prev) => [newTkt, ...prev]);
            }}
            openB2BModal={() => setIsB2BOpen(true)}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        setActiveTab={setActiveTab}
        openB2BModal={() => setIsB2BOpen(true)}
      />

      {/* Modals & Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        couponDiscount={couponDiscount}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        couponDiscount={couponDiscount}
        onOrderPlaced={handleOrderSuccess}
        onTrackOrder={(order) => handleOpenTracking(order)}
      />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      <B2BPortalModal
        isOpen={isB2BOpen}
        onClose={() => setIsB2BOpen(false)}
      />

      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        initialOrderIdOrTracking={trackingTargetId}
        recentOrders={orders}
        onOrderUpdated={(updated) => {
          setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
        }}
      />
    </div>
  );
}
