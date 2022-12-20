import { body, check } from 'express-validator';

export const createOrder = check('orderItems')
  .isArray()
  .withMessage('`orderItems` is not an array')
  .isLength({ min: 1 })
  .withMessage('At least one order item')
  .custom(value => {
    const orderItems = value as unknown[];

    return orderItems.every(item => {
      const orderItemKeys = ['bookID', 'amount', 'authorID'];
      const validKeys = Object.keys(item).every(key =>
        orderItemKeys.includes(key),
      );

      const orderItem = item as {
        bookID: unknown;
        amount: unknown;
        authorID: unknown;
      };

      const validAmount =
        typeof orderItem.amount === 'number' && orderItem.amount > 0;
      const validBookID = typeof orderItem.bookID === 'string';
      const validAuthorID = typeof orderItem.authorID === 'string';

      return validKeys && validAmount && validBookID && validAuthorID;
    });
  })
  .withMessage('Order item is invalid');

export const updateOrder = [
  body('status').isIn([
    'PROCESSING',
    'CONFIRMED',
    'IN_PROGRESS',
    'CANCELED',
    'DONE',
  ]),
];
