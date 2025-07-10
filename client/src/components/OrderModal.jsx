import React, { useState, useEffect } from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';


const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
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
  const [restaurant, setRestaurant] = useState(null);

  const [unitPrice] = useState(() => parseFloat((Math.random() * (18 - 3) + 3).toFixed(2)));
  const restaurantName = restaurant?.name || 'MoodBite Kitchen';
  const deliveryFee = 5.0;
  const taxRate = 0.1;

  const itemTotalPrice = quantity * unitPrice;
  const subtotal = itemTotalPrice;
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + deliveryFee + taxAmount;

  // Fetches restaurant based on the food user pick, this is based on cuisine column
  useEffect(() => {
    if (!food?.cuisine) return;
    const fetchRestaurant = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/restaurants?cuisine=${encodeURIComponent(food.cuisine)}`);
        const data = await res.json();
        if (data.length > 0) setRestaurant(data[0]);
      } catch (err) {
        console.error('Error fetching restaurant:', err);
      }
    };
    fetchRestaurant();
  }, [food]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);


  if (!food) return null;

  return (
    // --- Start of Modal --- 
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto relative overflow-y-auto max-h-[90vh]">
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

        {/* Quantity Part */}
        <div className="mb-4">
          <label htmlFor="quantity" className="block text-gray-700 text-sm font-bold mb-2">Quantity:</label>
          <div className="flex items-center">
            <button 
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))} 
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded-l-md hover:bg-gray-300"
            disabled={orderPlaced}>-</button>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 text-center border-t border-b border-gray-300 py-1"
              min="1"
              disabled={orderPlaced}
            />
            <button 
            onClick={() => setQuantity((prev) => prev + 1)} 
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded-r-md hover:bg-gray-300"
            disabled={orderPlaced}>+</button>
          </div>
        </div>

        {/* Order Details */}
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


        {/* Delivery Address Text Area */}
        <div className="mb-4">
          <label htmlFor="deliveryAddress" className="block text-gray-700 text-sm font-bold mb-2">Delivery Address:</label>
          <input
            type="text"
            id="deliveryAddress"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your delivery address"
            disabled={orderPlaced}
          />
        </div>


        {/* Transaction & Delivery Details later when user paid */}
        {orderPlaced && (
          <div className="mt-4 p-4 bg-amber-50 rounded-md">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Order Status:</h4>
            <p className="text-gray-700"><span className="font-medium">Delivery Status:</span> {deliveryStatus}</p>
            <p className="text-gray-700"><span className="font-medium">Payment Status:</span> {paymentStatus}</p>
            {deliveryStatus === 'Delivered' && <p className="text-green-600 font-bold mt-2">Enjoy your MoodBite!</p>}
          </div>
        )}
        

        {/* SPECIAL PAYPAL SECTION FOR PAYPAL BUTTONS  */}
        <div className="paypal-button-container overflow-visible mt-4">
          {!orderPlaced ? (
            <PayPalButtons
              style={{ shape: 'rect', layout: 'vertical', color: 'gold', label: 'paypal' }}
              disabled={!deliveryAddress || quantity < 1}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: { value: totalAmount.toFixed(2) },
                    },
                  ],
                });
              }}
              onApprove={async (data, actions) => {
                const details = await actions.order.capture();
                // console.log('Transaction approved:', details);
                setPaymentStatus('Paid');
                setDeliveryStatus('Preparing Order');

                try {
                  const token = localStorage.getItem('token');
                  const response = await fetch('http://localhost:8080/api/orders', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      food_name: food.name,
                      quantity,
                      unit_price: unitPrice,
                      delivery_fee: deliveryFee,
                      tax: taxAmount,
                      subtotal,
                      paypal_order_id: details.id,
                      paypal_payer_id: details.purchase_units[0].payee.merchant_id,
                      total_amount: totalAmount,
                      restaurant_id: restaurant?.restaurant_id || null,
                      delivery_address: deliveryAddress,
                    }),
                  });

                  if (response.ok) {
                    setOrderPlaced(true);
                    setTimeout(() => setDeliveryStatus('Out for Delivery'), 5000);
                    setTimeout(() => setDeliveryStatus('Delivered'), 10000);
                  } else {
                    const err = await response.json();
                    console.error('Save order failed', err);
                    alert('Order placed, Database failure.');
                  }
                } catch (err) {
                  console.error('Order DB error:', err);
                  alert('Internal Error. Please try again.');
                }
              }}
              onCancel={() => alert('Payment was cancelled.')}
              onError={(err) => {
                console.error('PayPal error:', err);
                alert('There was an issue with the PayPal transaction.');
              }}
            />
          ) : (
            <button onClick={onClose} className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-full transition-colors">Close</button>
          )}
        </div>

      </div>
    </div>
  );
}

export default OrderModal;
