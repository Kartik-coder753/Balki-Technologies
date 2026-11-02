import React, { useState } from 'react';
import { ClientReview, Product } from '../types';
import { 
  Star, 
  CheckCircle2, 
  ThumbsUp, 
  Building2, 
  GraduationCap, 
  MessageSquare, 
  Sparkles, 
  Filter, 
  Plus, 
  X,
  Send,
  ExternalLink
} from 'lucide-react';

interface ClientReviewsSectionProps {
  reviews: ClientReview[];
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddReview?: (newReview: ClientReview) => void;
}

export const ClientReviewsSection: React.FC<ClientReviewsSectionProps> = ({
  reviews: initialReviews,
  products,
  onSelectProduct,
  onAddReview
}) => {
  const [reviews, setReviews] = useState<ClientReview[]>(initialReviews);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // New Review Form State
  const [authorName, setAuthorName] = useState('');
  const [designation, setDesignation] = useState('');
  const [institution, setInstitution] = useState('');
  const [institutionType, setInstitutionType] = useState<ClientReview['institutionType']>('Private CBSE/ICSE');
  const [location, setLocation] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || 'prod-1');
  const [rating, setRating] = useState(5);
  const [headline, setHeadline] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [studentsImpacted, setStudentsImpacted] = useState('250');
  const [formSuccess, setFormSuccess] = useState(false);

  const filters = [
    'All',
    'Kendriya Vidyalaya',
    'Private CBSE/ICSE',
    'STEM Academy',
    'Govt Model School'
  ];

  const filteredReviews = reviews.filter((r) => {
    if (selectedFilter === 'All') return true;
    return r.institutionType === selectedFilter;
  });

  const handleLike = (id: string) => {
    setLikedReviews((prev) => {
      const isCurrentlyLiked = !!prev[id];
      const nextLiked = !isCurrentlyLiked;
      
      setReviews((cur) =>
        cur.map((rev) =>
          rev.id === id
            ? { ...rev, likesCount: rev.likesCount + (nextLiked ? 1 : -1) }
            : rev
        )
      );

      return { ...prev, [id]: nextLiked };
    });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !institution.trim() || !reviewText.trim()) return;

    const matchedProd = products.find((p) => p.id === selectedProductId) || products[0];

    const newRev: ClientReview = {
      id: `rev-${Date.now()}`,
      authorName,
      designation: designation || 'STEM Educator / Lab In-Charge',
      institution,
      institutionType,
      location: location || 'India',
      productId: matchedProd.id,
      productName: matchedProd.name,
      rating,
      date: 'Just now',
      verifiedPurchase: true,
      headline: headline || 'Outstanding hands-on STEM equipment for our school.',
      reviewText,
      studentsImpacted: Number(studentsImpacted) || 100,
      likesCount: 1,
      badge: 'Verified Educator'
    };

    setReviews([newRev, ...reviews]);
    if (onAddReview) onAddReview(newRev);

    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setIsSubmitModalOpen(false);
      // Reset form
      setAuthorName('');
      setDesignation('');
      setInstitution('');
      setHeadline('');
      setReviewText('');
    }, 1500);
  };

  return (
    <section id="client-reviews" className="rounded-3xl bg-white border border-slate-200/90 shadow-lg p-6 md:p-10 my-10 space-y-8">
      
      {/* Section Header Banner with Content-Related Background */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white p-6 md:p-10 border border-slate-800 shadow-xl space-y-6">
        {/* Content-Related Background Image */}
        <img
          src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1600&q=80"
          alt="School Classroom Science Innovation & Mentorship"
          referrerPolicy="no-referrer"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-overlay pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-amber-950/40 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10 border-b border-slate-800/80 pb-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Field Validation & Lab In-Charge Feedback</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Client & School Reviews for Products in Use
            </h2>
            <p className="mt-1 text-xs md:text-sm text-slate-300">
              Hear directly from school principals, ATL mentors, and lab coordinators who deployed Balki kits in actual classroom environments across India.
            </p>
          </div>

          {/* Write a Review Button */}
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl shadow-md transition-all shrink-0 self-start md:self-auto"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>Submit School / Lab Review</span>
          </button>
        </div>

        {/* Aggregate Scorecard Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 relative z-10">
          <div className="border-r border-slate-800/80 pr-4">
            <div className="flex items-center gap-1.5 text-amber-400 mb-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-white text-lg font-black ml-1">4.9 / 5.0</span>
            </div>
            <span className="text-[11px] text-slate-300">Based on 340+ School Labs</span>
          </div>

          <div className="border-r border-slate-800/80 pr-4 pl-2 md:pl-0">
            <span className="block text-xl font-black text-amber-400">99.4%</span>
            <span className="text-[11px] text-slate-300">School Re-Order Rate</span>
          </div>

          <div className="border-r border-slate-800/80 pr-4 pl-2 md:pl-0">
            <span className="block text-xl font-black text-emerald-400">125,000+</span>
            <span className="text-[11px] text-slate-300">Students Active in Labs</span>
          </div>

          <div className="pl-2 md:pl-0">
            <span className="block text-xl font-black text-amber-300">Zero Fault</span>
            <span className="text-[11px] text-slate-300">Doorstep Replacement Guarantee</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
          <Filter className="w-3 h-3 text-slate-400" />
          Filter:
        </span>
        {filters.map((flt) => (
          <button
            key={flt}
            onClick={() => setSelectedFilter(flt)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedFilter === flt
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {flt}
          </button>
        ))}
      </div>

      {/* Reviews Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReviews.map((review) => {
          const matchedProduct = products.find((p) => p.id === review.productId);
          const isLiked = !!likedReviews[review.id];

          return (
            <div
              key={review.id}
              className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 relative"
            >
              <div className="space-y-3">
                {/* Author Info & Verified Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={review.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                      alt={review.authorName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-2xs shrink-0"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">
                        {review.authorName}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {review.designation}
                      </p>
                      <p className="text-[10px] font-semibold text-amber-700">
                        {review.institution}, {review.location}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </span>
                </div>

                {/* Rating & Date */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <div className="flex items-center text-amber-500">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                    ))}
                    <span className="text-slate-800 font-extrabold ml-1.5 text-xs">{review.rating}.0</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{review.date}</span>
                </div>

                {/* Product Tag */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2 flex items-center justify-between text-[11px]">
                  <div className="line-clamp-1 font-medium text-slate-700">
                    <span className="text-slate-400 font-normal">Product: </span>
                    {review.productName}
                  </div>
                  {matchedProduct && (
                    <button
                      onClick={() => onSelectProduct(matchedProduct)}
                      title="View Product Specs"
                      className="text-amber-600 hover:text-amber-700 font-bold flex items-center gap-0.5 shrink-0 ml-1"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Headline & Body */}
                <h5 className="text-xs font-bold text-slate-900 leading-snug">
                  "{review.headline}"
                </h5>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {review.reviewText}
                </p>
              </div>

              {/* Bottom Footer: Impact & Upvote */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                {review.studentsImpacted ? (
                  <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                    🎓 {review.studentsImpacted}+ Students Impacted
                  </span>
                ) : (
                  <span />
                )}

                <button
                  onClick={() => handleLike(review.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    isLiked
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <ThumbsUp className={`w-3 h-3 ${isLiked ? 'fill-amber-700' : ''}`} />
                  <span>Helpful ({review.likesCount})</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Review Submission Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Submit Institutional Lab Review</h3>
                  <p className="text-xs text-slate-500">Share your school's experience using Balki STEM kits</p>
                </div>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formSuccess ? (
              <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-emerald-900">Review Published Successfully!</h4>
                <p className="text-xs text-emerald-700">Thank you for helping other Atal Tinkering Labs make informed hardware decisions.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Rajesh Sharma"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Designation / Role *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ATL In-Charge / Principal"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">School / Institution Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kendriya Vidyalaya No. 2"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">City, State *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jaipur, Rajasthan"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Institution Type</label>
                    <select
                      value={institutionType}
                      onChange={(e) => setInstitutionType(e.target.value as any)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 bg-white"
                    >
                      <option value="Kendriya Vidyalaya">Kendriya Vidyalaya</option>
                      <option value="Private CBSE/ICSE">Private CBSE / ICSE School</option>
                      <option value="Govt Model School">Govt Model School</option>
                      <option value="STEM Academy">STEM Academy</option>
                      <option value="University/College">University / College</option>
                      <option value="Industry Lab">Industry / Corporate Lab</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Product Used *</label>
                    <select
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 bg-white"
                    >
                      {products.map((prod) => (
                        <option key={prod.id} value={prod.id}>
                          {prod.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Rating selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Overall Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setRating(num)}
                        className="p-1 text-amber-500 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            num <= rating ? 'fill-amber-500 text-amber-500' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-2">{rating} out of 5 stars</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Review Headline *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Robust hardware and exceptional teacher training"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Review & Classroom Experience *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe how students interact with the kits, reliability of the components, curriculum ease, and support received..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Students Impacted</label>
                  <input
                    type="number"
                    placeholder="e.g. 500"
                    value={studentsImpacted}
                    onChange={(e) => setStudentsImpacted(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Review</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </section>
  );
};
