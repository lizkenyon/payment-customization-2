// @ts-check

/**
* @typedef {import("../generated/api").InputQuery} InputQuery
* @typedef {import("../generated/api").FunctionResult} FunctionResult
* @typedef {import("../generated/api").HideOperation} HideOperation
*/

/**
* @type {FunctionResult}
*/
const NO_CHANGES = {
  operations: [],
};

export default /**
* @param {InputQuery} input
* @returns {FunctionResult}
*/
(input) => {
  // Define a type for your configuration, and parse it from the metafield
  /**
  * @type {{
  *   paymentMethodName: string
  *   cartTotal: number
  * }}
  */
 // [START payment_customization-move-payment-method.using_input_value]
  const configuration = JSON.parse(
    input?.paymentCustomization?.metafield?.value ?? "{}"
  );
  if (!configuration.paymentMethodName || !configuration.cartTotal) {
    return NO_CHANGES;
  }

  const cartTotal = parseFloat(input.cart.cost.totalAmount.amount ?? "0.0");
  // Use the configured cart total instead of a hardcoded value
  if (cartTotal > configuration.cartTotal) {
    console.error("Cart total is too high enough, no need to move the payment method.");
    return NO_CHANGES;
  }

  // Use the configured payment method name instead of a hardcoded value
  const movePaymentMethod = input.paymentMethods
    .find(method => method.name.includes(configuration.paymentMethodName));
  // [END payment_customization-move-payment-method.using_input_value]

  if (!movePaymentMethod) {
    return NO_CHANGES;
  }
// [START payment_customization-move-payment-method.return_operations]
  return {
    operations: [{
      move: {
        index: 0,
        paymentMethodId: movePaymentMethod.id
      }
    }]
  };
// [END payment_customization-move-payment-method.return_operations]
};

