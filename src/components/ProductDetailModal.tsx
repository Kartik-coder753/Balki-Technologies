import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Shield, 
  Truck, 
  Cpu, 
  Package, 
  BookOpen, 
  Star, 
  ShoppingCart,
  Zap,
  Tag,
  Download
} from 'lucide-react';
import { Product } from '../types';
import { downloadProductDatasheet } from '../utils/downloadHelpers';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow
}) => {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>(product?.image || '');

  React.useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const galleryList = product.gallery && product.gallery.length > 0
    ? (product.gallery.includes(product.image) ? product.gallery : [product.image, ...product.gallery])
    : [product.image];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto sm:my-8 max-h-[94vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 bg-slate-50 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-[11px] font-bold uppercase rounded-md bg-amber-100 text-amber-800 border border-amber-200">
              {product.gradeLevel}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              SKU: {product.sku}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
            {/* Image & Badges */}
            <div className="space-y-4">
              <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
                <img
                  src={activeImage || product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/aistudio/1_08ee71b2.webp';
                  }}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                {product.atlCertified && (
                  <div className="absolute top-3 left-3 bg-amber-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm">
                    ATL Certified
                  </div>
                )}
              </div>

              {/* Gallery Thumbnails */}
              {galleryList.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {galleryList.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(imgUrl)}
                      className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                        (activeImage || product.image) === imgUrl 
                          ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-xs' 
                          : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-400'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${product.name} angle ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=150&q=80';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{product.warrantyMonths} Months Warranty</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Pan-India Delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>NEP 2020 Aligned</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>{product.warehouseLocation}</span>
                </div>
              </div>
            </div>

            {/* Product Details & Purchase */}
            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 leading-snug">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span className="ml-1 text-xs font-bold text-slate-800">{product.rating}</span>
                  </div>
                  <span className="text-xs text-slate-400">({product.reviewsCount} verified school reviews)</span>
                </div>

                {/* Price */}
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-2xl font-extrabold text-slate-900">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-slate-400 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Inclusive of 18% GST • GST Invoice provided for school input tax credit
                </p>

                {/* Stock status */}
                <div className="mt-3">
                  {product.stock > 0 ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      In Stock ({product.stock} units available)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      Out of Stock (Restocking in 3 days)
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mt-4">
                  {product.description}
                </p>
              </div>

              {/* Quantity & Actions */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-700">Quantity:</span>
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-sm font-semibold text-slate-600 hover:bg-slate-200"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-bold text-slate-800 min-w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-1 text-sm font-semibold text-slate-600 hover:bg-slate-200"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    id="btn-modal-add-to-cart"
                    onClick={() => {
                      onAddToCart(product, quantity);
                      onClose();
                    }}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-amber-600 text-amber-700 hover:bg-amber-50 text-xs font-bold transition-all cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    id="btn-modal-buy-now"
                    onClick={() => {
                      onBuyNow(product, quantity);
                      onClose();
                    }}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Buy Now</span>
                  </button>
                </div>

                {/* Download Datasheet Button */}
                <button
                  id="btn-modal-download-datasheet"
                  onClick={() => downloadProductDatasheet(product)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-amber-600" />
                  <span>Download Technical Datasheet (PDF)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tabbed Specs: Features & What's In the Box */}
          <div className="border-t border-slate-200 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-amber-600" />
                Key Capabilities & Features
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-amber-600" />
                What's In The Box
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                {product.whatsInBox.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
