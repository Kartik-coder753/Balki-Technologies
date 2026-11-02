import React, { useState, useEffect } from 'react';
import { 
  Star, 
  CheckCircle2, 
  ThumbsUp, 
  Building2, 
  Sparkles, 
  Filter, 
  Plus, 
  X, 
  Send, 
  Globe, 
  Package, 
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { collection, onSnapshot, doc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db, handleFirestoreError } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { ClientReview, Product } from '../types';

interface ClientReviewsHubProps {
  products: Product[];
  onSelectProduct?: (product: Product) => void;
}

export const ClientReviewsHub: React.FC<ClientReviewsHubProps> = ({
  products,
  onSelectProduct
}) => {
  const { currentUser, userProfile } = useAuth();
  const [reviews, setReviews] = useState<ClientReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'website' | 'product' | '5stars'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});

  // Form State
  const [targetType, setTargetType] = useState<'website' | 'product'>('website');
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [rating, setRating] = useState<number>(5);
  const [headline, setHeadline] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [studentsImpacted, setStudentsImpacted] = useState<string>('150');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Firestore Real-time Listener for Reviews
  useEffect(() => {
    try {
      const reviewsCol = collection(db, 'reviews');
      const unsubscribe = onSnapshot(
        reviewsCol,
        (snapshot) => {
          const list: ClientReview[] = [];
          snapshot.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as ClientReview);
          });
          // Sort newest first
          list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
          setReviews(list);
          setLoading(false);
        },
        (error) => {
          handleFirestoreError(error, 'read', 'reviews');
          // Fallback to fetch from server API if Firestore query fails
          fetch('/api/reviews')
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => {
              setReviews(data);
              setLoading(false);
            })
            .catch(() => setLoading(false));
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn('Reviews listener setup error, falling back to REST API', err);
      fetch('/api/reviews')
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          setReviews(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, []);

  const handleLike = async (reviewId: string) => {
    const isCurrentlyLiked = !!likedReviews[reviewId];
    const nextLiked = !isCurrentlyLiked;

    setLikedReviews((prev) => ({ ...prev, [reviewId]: nextLiked }));

    // Optimistically update UI
    setReviews((cur) =>
      cur.map((r) =>
        r.id === reviewId
          ? { ...r, likesCount: (r.likesCount || 0) + (nextLiked ? 1 : -1) }
          : r
      )
    );

    try {
      const reviewDocRef = doc(db, 'reviews', reviewId);
      await updateDoc(reviewDocRef, {
        likesCount: increment(nextLiked ? 1 : -1)
      });
    } catch (err) {
      // Non-fatal if offline
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      setErrorMessage('Please write your review feedback.');
      return;
    }
    if (!currentUser) {
      setErrorMessage('You must be a registered client to submit a review.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const reviewId = `rev-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const authorName = userProfile?.displayName || currentUser.displayName || 'Registered Client';
      const institution = userProfile?.institution || 'Atal Tinkering Partner';
      const institutionType = userProfile?.institutionType || 'Kendriya Vidyalaya';
      const now = new Date();
      const dateFormatted = now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      let productName = 'Balki Technologies Web Platform & Lab Services';
      let prodId = 'platform-service';

      if (targetType === 'product') {
        const prod = products.find((p) => p.id === selectedProductId) || products[0];
        if (prod) {
          productName = prod.name;
          prodId = prod.id;
        }
      }

      const reviewPayload: ClientReview = {
        id: reviewId,
        userId: currentUser.uid,
        authorName,
        designation: userProfile?.role || 'Verified STEM Client',
        institution,
        institutionType: institutionType as any,
        location: 'India',
        productId: prodId,
        productName,
        rating,
        date: dateFormatted,
        verifiedPurchase: true,
        headline: headline.trim() || `${rating} Star Feedback for ${targetType === 'website' ? 'Platform Services' : productName}`,
        reviewText: reviewText.trim(),
        studentsImpacted: Number(studentsImpacted) || 100,
        likesCount: 1,
        badge: 'Verified Registered Client',
        targetType
      };

      // 1. Write to Firestore
      const reviewDocRef = doc(db, 'reviews', reviewId);
      await setDoc(reviewDocRef, reviewPayload);

      // 2. Also inform server API
      try {
        await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reviewPayload)
        });
      } catch (e) {
        // Safe to ignore server sync error
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setIsModalOpen(false);
        setHeadline('');
        setReviewText('');
      }, 1200);
    } catch (err: any) {
      console.error('Error submitting review:', err);
      handleFirestoreError(err, 'create', 'reviews');
      setErrorMessage(err.message || 'Failed to publish review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (filter === 'website') return r.targetType === 'website' || r.productId === 'platform-service';
    if (filter === 'product') return r.targetType === 'product' || (r.productId && r.productId !== 'platform-service');
    if (filter === '5stars') return r.rating === 5;
    return true;
  });

  return (
    <section className="bg-gradient-to-b from-slate-50 to-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-8 my-10">
      {/* Header with Title and Add Review CTA */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Exclusively for Registered Clients</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Verified Client Reviews & Testimonials
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Real feedback submitted by authenticated school ATL educators, university mentors, and robotics lab directors.
          </p>
        </div>

        <button
          id="btn-add-client-review"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Add a Review</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            All Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setFilter('website')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              filter === 'website'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Website & Lab Services</span>
          </button>
          <button
            onClick={() => setFilter('product')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              filter === 'product'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Product Hardware</span>
          </button>
          <button
            onClick={() => setFilter('5stars')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              filter === '5stars'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>5 Stars Only</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Logged in as: <span className="font-bold text-slate-800">{userProfile?.displayName || currentUser?.email}</span>
        </div>
      </div>

      {/* Reviews Content */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs">
          Loading client feedback from database...
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-14 px-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
            <MessageSquare className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              No Client Reviews Published Yet
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              All demo reviews have been purged. As an authenticated registered client, you can submit the first verified review for the Balki platform or our STEM kits!
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Write the First Review</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => {
            const isLiked = !!likedReviews[rev.id];
            const isWebsiteReview = rev.targetType === 'website' || rev.productId === 'platform-service';

            return (
              <div
                key={rev.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Rating Stars and Date */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= rev.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {rev.date}
                    </span>
                  </div>

                  {/* Review Target Tag */}
                  <div className="flex items-center gap-2">
                    {isWebsiteReview ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        <Globe className="w-3 h-3" />
                        <span>Website & Services Review</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        <Package className="w-3 h-3" />
                        <span className="truncate max-w-[200px]">{rev.productName}</span>
                      </span>
                    )}
                  </div>

                  {/* Headline */}
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    "{rev.headline}"
                  </h4>

                  {/* Review Text */}
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                    {rev.reviewText}
                  </p>
                </div>

                {/* Author Info & Footer */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-600 to-orange-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                      {rev.authorName ? rev.authorName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {rev.authorName}
                        </p>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" title="Verified Registered Client" />
                      </div>
                      <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{rev.institution || 'Registered Institution'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      ✓ Registered User
                    </span>

                    <button
                      onClick={() => handleLike(rev.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        isLiked
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-amber-600 text-amber-600' : ''}`} />
                      <span>{rev.likesCount || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Review Modal for Registered Users */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Verified Registered Client Form</span>
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  Submit Client Review
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Your feedback helps schools across India select certified ATL robotics hardware and curriculum kits.
                </p>
              </div>

              {submitSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-semibold animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Your review has been saved to the database and published live!</span>
                </div>
              )}

              {errorMessage && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                {/* Verified User Details Header */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">
                      {userProfile?.displayName || currentUser?.displayName || 'Registered Client'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {userProfile?.institution || 'Atal Tinkering Partner'} • {currentUser?.email}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full">
                    Authenticated
                  </span>
                </div>

                {/* Review Target Type */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">What are you reviewing?</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setTargetType('website')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        targetType === 'website'
                          ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Globe className="w-4 h-4 mb-1 text-amber-600" />
                      <p className="text-xs">Website & Services</p>
                      <p className="text-[10px] text-slate-500 font-normal">Platform, checkout, quotations & logistics</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTargetType('product')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        targetType === 'product'
                          ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Package className="w-4 h-4 mb-1 text-amber-600" />
                      <p className="text-xs">Specific STEM Product</p>
                      <p className="text-[10px] text-slate-500 font-normal">Robotics kits, sensors, lab gear</p>
                    </button>
                  </div>
                </div>

                {/* If Product Review, Product Selector */}
                {targetType === 'product' && (
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Select Product</label>
                    <select
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs outline-none focus:border-amber-500"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (₹{p.price.toLocaleString('en-IN')})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Star Rating */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setRating(s)}
                        className="p-1 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            s <= rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-600 ml-2">
                      {rating === 5 && 'Exceptional (5/5)'}
                      {rating === 4 && 'Very Good (4/5)'}
                      {rating === 3 && 'Average (3/5)'}
                      {rating === 2 && 'Needs Improvement (2/5)'}
                      {rating === 1 && 'Poor (1/5)'}
                    </span>
                  </div>
                </div>

                {/* Headline */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Review Headline</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Seamless school order delivery and exceptional hardware quality"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs outline-none focus:border-amber-500"
                  />
                </div>

                {/* Detailed Review */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Detailed Feedback</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your hands-on experience, kit packaging, ease of curriculum setup, or student engagement..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs outline-none focus:border-amber-500"
                  />
                </div>

                {/* Approximate Students Impacted */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Approximate Students Impacted in your Lab</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 150"
                    value={studentsImpacted}
                    onChange={(e) => setStudentsImpacted(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs outline-none focus:border-amber-500"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 disabled:bg-slate-300"
                  >
                    {isSubmitting ? (
                      <span>Saving to Database...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Publish Review</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
