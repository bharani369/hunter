import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Star, Trash2, Search, MessageSquare, Tag } from 'lucide-react';
import { useToast } from '../components/ToastContainer';
import { Review } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRating, setSelectedRating] = useState<number | 'all'>('all');
  const showToast = useToast();

  useEffect(() => {
    const q = query(collection(db, 'reviews'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReviews(fetched);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'reviews');
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteReview = async (reviewId: string, productId: string) => {
    console.log('Attempting to delete review:', reviewId, 'Product ID:', productId);
    if (!window.confirm('Are you sure you want to delete this review? This action is permanent.')) {
      return;
    }
    try {
      if (!productId) {
        throw new Error('Product ID is missing');
      }
      // 1. Delete review from Firestore
      await deleteDoc(doc(db, 'reviews', reviewId));

      // 2. Load and recalculate product ratings and counts
      // Filter out the deleted review from our current local list
      const remainingReviewsForProduct = reviews.filter(
        (r) => r.productId === productId && r.id !== reviewId
      );

      let newAverageRating = 4.5; // default preset rating
      const newTotalReviews = remainingReviewsForProduct.length;

      if (newTotalReviews > 0) {
        const sumRatings = remainingReviewsForProduct.reduce((sum, r) => sum + r.rating, 0);
        newAverageRating = Number((sumRatings / newTotalReviews).toFixed(1));
      }

      // 3. Update product document in firestore
      await updateDoc(doc(db, 'products', productId), {
        rating: newAverageRating,
        reviews: newTotalReviews
      });

      showToast('Review deleted successfully, and product metrics updated!');
    } catch (error) {
      console.error('Error deleting review:', error);
      showToast('Failed to delete review: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = 
      (review.author || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (review.text || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (review.productName || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRating = selectedRating === 'all' || review.rating === selectedRating;

    return matchesSearch && matchesRating;
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-fk-blue" />
            User Ratings & Reviews Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Displaying real review submissions. Deleting reviews will automatically update product star counts and average ratings.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by author, product, content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-200 rounded px-9 py-1.5 text-sm outline-none focus:border-fk-blue focus:ring-1 focus:ring-fk-blue bg-white"
            />
          </div>

          {/* Rating dropdown */}
          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="border border-gray-200 rounded px-3 py-1.5 text-sm outline-none bg-white font-medium text-gray-700 min-w-[120px]"
          >
            <option value="all">All Stars</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-500">
          <div className="w-10 h-10 border-4 border-fk-blue border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          Loading dynamic ratings and reviews...
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="py-16 text-center text-gray-500 border border-dashed border-gray-200 rounded-lg bg-gray-50/50">
          <p className="font-semibold text-gray-700 mb-1">No matches found</p>
          <p className="text-sm text-gray-400">
            {searchQuery || selectedRating !== 'all' 
              ? 'Try adjusting your search filters or queries.' 
              : 'There are no active user reviews in the database yet.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 font-semibold border-b border-gray-100">
              <tr>
                <th scope="col" className="px-6 py-4">Product Name</th>
                <th scope="col" className="px-6 py-4">Reviewer</th>
                <th scope="col" className="px-6 py-4">Rating</th>
                <th scope="col" className="px-6 py-4">Review Message</th>
                <th scope="col" className="px-6 py-4">Date</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
              {filteredReviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50/50 transition">
                  {/* Product */}
                  <td className="px-6 py-4 font-semibold text-gray-950">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate max-w-[160px]" title={review.productName}>{review.productName || review.productId}</span>
                    </div>
                  </td>
                  
                  {/* Author / User */}
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    <div>
                      <p>{review.author}</p>
                      <span className="text-[10px] text-gray-400 font-mono font-normal">ID: {review.userId === 'guest' ? 'Guest' : review.userId?.substring(0, 8)}</span>
                    </div>
                  </td>

                  {/* Rating Stars */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className={`text-white text-xs px-2 py-0.5 rounded-[3px] font-bold flex items-center gap-0.5 ${
                        review.rating >= 4 ? 'bg-fk-green' : review.rating === 3 ? 'bg-fk-yellow text-black' : 'bg-red-500'
                      }`}>
                        {review.rating} ★
                      </span>
                    </div>
                  </td>

                  {/* Review Text */}
                  <td className="px-6 py-4 font-normal text-gray-600">
                    <p className="max-w-[280px] break-words line-clamp-3 text-xs leading-relaxed" title={review.text}>
                      {review.text}
                    </p>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400 font-medium">
                    {review.date}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleDeleteReview(review.id, review.productId)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition inline-flex items-center"
                      title="Delete Review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
