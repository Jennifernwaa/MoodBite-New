import React, { useState, useEffect } from 'react';

// A simple utility to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD', // Adjust currency as needed (e.g., 'IDR' for Indonesian Rupiah)
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

function OrderModal({ food, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState('Pending Confirmation');
  const [paymentStatus, setPaymentStatus] = useState('Unpaid');

  // --- Mock Data (Replace with real data/API calls) ---
  const unitPrice = food.price || 15.00; // Use food.price if available, otherwise a default
  const restaurantName = food.restaurant_name || 'MoodBite Kitchen'; // Assuming food has a restaurant_name
  const deliveryFee = 5.00;
  const taxRate = 0.10; // 10% tax

  // Calculate totals
  const itemTotalPrice = quantity * unitPrice;
  const subtotal = itemTotalPrice;
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + deliveryFee + taxAmount;

    // Order process
    const handlePlaceOrder = async () => {
    if (!deliveryAddress) {
        alert('Please enter a delivery address.');
        return;
    }

    setOrderPlaced(false); // Reset in case of re-attempt
    setPaymentStatus('Processing Payment'); // Set processing state early
    setDeliveryStatus('Pending Confirmation'); // Reset delivery status

    try {
        const token = localStorage.getItem('token');
        if (!token) {
        alert('You must be logged in to place an order.');
        // Optionally redirect to login or handle unauthenticated state
        return;
        }

        const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            food_name: food.name,
            quantity,
            unit_price: unitPrice,
            delivery_fee: deliveryFee,
            tax: taxAmount,
            subtotal,
            total_amount: totalAmount,
            restaurant_id: food.restaurant_id,
            delivery_address: deliveryAddress,
        }),
        });

        const data = await response.json();

        if (response.ok) {
        setOrderPlaced(true); // Now truly placed
        setPaymentStatus('Paid'); // Only if backend confirms payment
        setDeliveryStatus('Preparing Order'); // Only if backend confirms order initiation

        // You can then use WebSockets or polling to update delivery status
        // For now, if you want client-side simulation AFTER successful order:
        // Simulate delivery process (only if order was successful)
        setTimeout(() => {
            setDeliveryStatus('Out for Delivery');
        }, 5000); // 5 seconds later

        setTimeout(() => {
            setDeliveryStatus('Delivered');
        }, 10000); // 10 seconds later

        } else {
        // If response is NOT ok, revert or show error
        setOrderPlaced(false);
        setPaymentStatus('Failed'); // Indicate payment failure
        alert(data.error || `Failed to place order: ${response.statusText}`);
        }
    } catch (err) {
        console.error('Order failed:', err);
        setOrderPlaced(false);
        setPaymentStatus('Failed'); // Indicate payment failure
        alert('An error occurred while placing the order. Please check console for details.');
    }
    };


  // Prevent scrolling when the modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!food) return null; // Don't render if no food data is passed

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto relative overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
        >
          <i className="fas fa-times"></i>
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirm Your Order</h2>

        {/* Food Details */}
        <div className="flex items-center mb-4 border-b pb-4">
          <img
            src={food.imageUrl || 'https://via.placeholder.com/100x100?text=Food'}
            alt={food.name}
            className="w-24 h-24 object-cover rounded-md mr-4"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{food.name}</h3>
            <p className="text-gray-600">from <span className="font-medium">{restaurantName}</span></p>
            <p className="text-lg font-bold text-amber-600">{formatCurrency(unitPrice)} / unit</p>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="mb-4">
          <label htmlFor="quantity" className="block text-gray-700 text-sm font-bold mb-2">
            Quantity:
          </label>
          <div className="flex items-center">
            <button
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-l-md hover:bg-gray-300"
            >
              -
            </button>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 text-center border-t border-b border-gray-300 py-1"
              min="1"
            />
            <button
              onClick={() => setQuantity(prev => prev + 1)}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-r-md hover:bg-gray-300"
            >
              +
            </button>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="mb-4 border-t pt-4">
          <div className="flex justify-between text-gray-700 mb-2">
            <span>Item Total ({quantity}x {food.name}):</span>
            <span>{formatCurrency(itemTotalPrice)}</span>
          </div>
          <div className="flex justify-between text-gray-700 mb-2">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-700 mb-2">
            <span>Delivery Fee:</span>
            <span>{formatCurrency(deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-gray-700 mb-2">
            <span>Tax ({taxRate * 100}%):</span>
            <span>{formatCurrency(taxAmount)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-gray-900 mt-4 pt-2 border-t border-gray-300">
            <span>Total Amount:</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        {/* Delivery Address Input */}
        <div className="mb-4">
          <label htmlFor="deliveryAddress" className="block text-gray-700 text-sm font-bold mb-2">
            Delivery Address:
          </label>
          <input
            type="text"
            id="deliveryAddress"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your delivery address"
            disabled={orderPlaced} // Disable input after order is placed
          />
        </div>

        {/* Order & Payment Status */}
        {orderPlaced && (
          <div className="mt-4 p-4 bg-amber-50 rounded-md">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Order Status:</h4>
            <p className="text-gray-700">
              <span className="font-medium">Delivery Status:</span> {deliveryStatus}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Payment Status:</span> {paymentStatus}
            </p>
            {deliveryStatus === 'Delivered' && (
              <p className="text-green-600 font-bold mt-2">Enjoy your MoodBite!</p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          {!orderPlaced ? (
            <>
              <button
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePlaceOrder}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-full transition-colors"
                disabled={!deliveryAddress || quantity < 1} // Disable if no address or quantity is invalid
              >
                Place Order
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-full transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderModal;