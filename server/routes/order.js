const router = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');

router.post('/', authorization, async (req, res) => {
  try {
    const user_id = req.user.id; // from token
    const {
      food_name,
      quantity,
      unit_price,
      subtotal,
      delivery_fee,
      tax,
      total_amount,
      restaurant_id,
      delivery_address
    } = req.body;

    const orderResult = await pool.query(
      `INSERT INTO orders (user_id, restaurant_id, subtotal, delivery_fee, tax, total_amount, status, payment_status, delivery_address, ordered_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'Pending', 'Unpaid', $7, NOW()) RETURNING *`,
      [user_id, restaurant_id, subtotal, delivery_fee, tax, total_amount, delivery_address]
    );

    const order_id = orderResult.rows[0].order_id;

    await pool.query(
      `INSERT INTO order_items (order_id, food_name, quantity, unit_price, total_price, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [order_id, food_name, quantity, unit_price, quantity * unit_price]
    );

    res.status(201).json({ message: 'Order placed successfully' });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
