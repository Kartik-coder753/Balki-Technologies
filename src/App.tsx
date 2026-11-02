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
import { HackathonSection } from './components/HackathonSection';
import { CoursesSection } from './components/CoursesSection';
import { RentalsSection } from './components/RentalsSection';
import { InventoryManager } from './components/InventoryManager';
import { ClientDashboard } from './components/ClientDashboard';
import { CareersSection } from './components/CareersSection';
import { ContactSupportSection } from './components/ContactSupportSection';
import { AboutUsSection } from './components/AboutUsSection';
import { BlogSection } from './components/BlogSection';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { B2BPortalModal } from './components/B2BPortalModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPortal } from './components/AuthPortal';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError } from './lib/firebase';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { currentUser, userProfile, loading, updateProfileData } = useAuth();

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

  // Sync userProgress with authenticated client profile dynamically
  useEffect(() => {
    if (userProfile || currentUser) {
      setUserProgress(prev => ({
        ...prev,
        studentName: userProfile?.displayName || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Client Member',
        schoolName: userProfile?.institution || 'Atal Tinkering Lab Partner',
        grade: userProfile?.role || 'Innovator'
      }));
    }
  }, [userProfile, currentUser]);

  // Real-time Firestore sync for client's orders
  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      return;
    }

    try {
      const ordersCol = collection(db, 'orders');
      const q = query(ordersCol, where('userId', '==', currentUser.uid));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: Order[] = [];
          snapshot.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as Order);
          });
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setOrders(list);
        },
        (err) => {
          console.warn('Orders listener fallback', err);
          handleFirestoreError(err, 'read', 'orders');
        }
      );

      return () => unsubscribe();
    } catch (e) {
      console.warn('Failed to subscribe to client orders in Firestore', e);
    }
  }, [currentUser]);

  const handleOpenTracking = (orderOrId?: Order | string) => {
    if (typeof orderOrId === 'string') {
      setTrackingTargetId(orderOrId);
    } else if (orderOrId && typeof orderOrId === 'object') {
      setTrackingTargetId(orderOrId.id || orderOrId.trackingNumber);
    } else if (orders.length > 0) {
      setTrackingTargetId(orders[0].id);
    } else {
      setTrackingTargetId('');
    }
    setIsTrackingOpen(true);
  };

  // Initial Fetch from backend APIs for catalog and public services
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, courseRes, rentRes, invRes, caseRes, tktRes] = await Promise.all([
          fetch('/api/products').catch(() => null),
          fetch('/api/courses').catch(() => null),
          fetch('/api/rentals').catch(() => null),
          fetch('/api/inventory').catch(() => null),
          fetch('/api/case-studies').catch(() => null),
          fetch('/api/support/tickets').catch(() => null)
        ]);

        if (prodRes && prodRes.ok) setProducts(await prodRes.json());
        if (courseRes && courseRes.ok) setCourses(await courseRes.json());
        if (rentRes && rentRes.ok) setRentals(await rentRes.json());
        if (invRes && invRes.ok) setInventory(await invRes.json());
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

  // Complete Order & Update Client Purchase History
  const handleOrderSuccess = async (order: Order) => {
    setOrders(prev => [order, ...prev]);
    setCartItems([]);
    setCouponDiscount(0);
    setAppliedCoupon('');

    // Update client purchasing metrics in profile
    try {
      await updateProfileData({
        hasPurchased: true,
        totalOrdersCount: (userProfile?.totalOrdersCount || 0) + 1,
        totalSpent: (userProfile?.totalSpent || 0) + (order.totalAmount || 0)
      });
    } catch (e) {
      console.warn('Failed to update client purchasing stats in profile:', e);
    }

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
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update Inventory Stock
  const handleUpdateStock = (sku: string, newStock: number) => {
    setInventory(prev =>
      prev.map(item =>
        item.sku === sku
          ? {
              ...item,
              currentStock: newStock,
              status: newStock <= 0 ? 'Critical' : newStock <= item.minimumThreshold ? 'Low Stock' : 'In Stock',
              lastRestocked: new Date().toISOString().split('T')[0]
            }
          : item
      )
    );
    setProducts(prev =>
      prev.map(p => (p.sku === sku ? { ...p, stock: newStock } : p))
    );
  };

  // While checking authentication state, show branded loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-center space-y-1">
          <p className="text-xs font-bold tracking-widest text-amber-400 uppercase">
            Balki Technologies
          </p>
          <p className="text-xs text-slate-400 font-mono">
            Verifying Authenticated Client Session...
          </p>
        </div>
      </div>
    );
  }

  // MANDATORY LOGIN WALL: If not signed in, show AuthPortal
  if (!currentUser) {
    return <AuthPortal />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-amber-500 selection:text-white overflow-x-hidden">
      {/* Global Navigation Bar */}
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

      {/* Main Routed Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 lg:pb-8">
        
        {activeTab === 'home' && (
          <StoreSection
            products={products}
            selectedCategory="all"
            setSelectedCategory={setStoreCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onSelectProduct={(product) => setSelectedProduct(product)}
            openB2BModal={() => setIsB2BOpen(true)}
            onNavigate={(tab) => setActiveTab(tab)}
            courses={courses}
            rentals={rentals}
            caseStudies={caseStudies}
            reviews={reviews}
            onAddReview={(newRev) => setReviews((prev) => [newRev, ...prev])}
          />
        )}

        {activeTab === 'store' && (
          <StoreSection
            products={products}
            selectedCategory={storeCategory}
            setSelectedCategory={setStoreCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onSelectProduct={(product) => setSelectedProduct(product)}
            openB2BModal={() => setIsB2BOpen(true)}
            onNavigate={(tab) => setActiveTab(tab)}
            courses={courses}
            rentals={rentals}
            caseStudies={caseStudies}
            reviews={reviews}
            onAddReview={(newRev) => setReviews((prev) => [newRev, ...prev])}
          />
        )}

        {activeTab === 'quotations' && (
          <QuotationsSection
            onOpenB2BModal={() => setIsB2BOpen(true)}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        )}

        {activeTab === 'hackathon' && (
          <HackathonSection
            onOpenStore={() => {
              setActiveTab('store');
              window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <ClientDashboard
            orders={orders}
            rentals={rentalBookings}
            courses={courses}
            userProgress={userProgress}
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

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
