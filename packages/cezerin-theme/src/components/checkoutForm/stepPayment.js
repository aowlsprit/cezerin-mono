import React from 'react';
import { text } from '../../lib/settings';
import PaymentForm from './paymentForm';

const CheckoutStepPayment = props => {
  const {
    cart,
    settings,
    processingCheckout,
    handleSuccessPayment,
    inputClassName,
    buttonClassName,
    show,
    title,
    onCreateToken
  } = props;

  const { payment_method_gateway: paymentMethodGateway, grand_total: grandTotal } = cart;

  if (!show) {
    return (
      <div className="checkout-step">
        <h1>
          <span>3</span>
          {title}
        </h1>
      </div>
    );
  }
  return (
    <div className="checkout-step">
      <h1>
        <span>3</span>
        {title}
      </h1>
      <div className="checkout-button-wrap">
        {!processingCheckout && (
          <PaymentForm
            gateway={paymentMethodGateway}
            amount={grandTotal}
            shopSettings={settings}
            onPayment={handleSuccessPayment}
            inputClassName={inputClassName}
            buttonClassName={buttonClassName}
            onCreateToken={onCreateToken}
          />
        )}
        {processingCheckout && <p>{text.loading}</p>}
      </div>
    </div>
  );
};

export default CheckoutStepPayment;
