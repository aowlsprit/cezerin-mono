import OrdersService from '../services/orders/orders';
import SettingsService from '../services/settings/settings';
import PaymentGatewaysService from '../services/settings/paymentGateways';
import PayPalCheckout from './PayPalCheckout';
import LiqPay from './LiqPay';
import StripeElements from './StripeElements';
import StripeBancontact from './StripeBancontact';

const getOptions = orderId =>
  Promise.all([OrdersService.getSingleOrder(orderId), SettingsService.getSettings()]).then(([order, settings]) => {
    if (order && order.payment_method_id) {
      return PaymentGatewaysService.getGateway(order.payment_method_gateway).then(gatewaySettings => {
        const options = {
          gateway: order.payment_method_gateway,
          gatewaySettings,
          order,
          amount: order.grand_total,
          currency: settings.currency_code
        };

        return options;
      });
    }
  });

const getPaymentFormSettings = orderId =>
  getOptions(orderId).then(options => {
    switch (options.gateway) {
      case 'paypal-checkout':
        return PayPalCheckout.getPaymentFormSettings(options);
      case 'liqpay':
        return LiqPay.getPaymentFormSettings(options);
      case 'stripe-elements':
        return StripeElements.getPaymentFormSettings(options);
      case 'stripe-bancontact':
        return StripeBancontact.getPaymentFormSettings(options);
      default:
        return Promise.reject(new Error('Invalid gateway'));
    }
  });

const paymentNotification = (req, res, gateway) =>
  PaymentGatewaysService.getGateway(gateway).then(gatewaySettings => {
    const options = {
      gateway,
      gatewaySettings,
      req,
      res
    };

    switch (gateway) {
      case 'paypal-checkout':
        return PayPalCheckout.paymentNotification(options);
      case 'liqpay':
        return LiqPay.paymentNotification(options);
      default:
        return Promise.reject(new Error('Invalid gateway'));
    }
  });

const processOrderPayment = async order => {
  const orderAlreadyCharged = order.paid === true;
  if (orderAlreadyCharged) {
    return true;
  }

  const gateway = order.payment_method_gateway;
  const gatewaySettings = await PaymentGatewaysService.getGateway(gateway);
  const settings = await SettingsService.getSettings();

  switch (gateway) {
    case 'stripe-elements':
      return StripeElements.processOrderPayment({
        order,
        gatewaySettings,
        settings
      });
    case 'stripe-bancontact':
      return StripeBancontact.processOrderPayment({
        order,
        gatewaySettings,
        settings
      });
    default:
      return Promise.reject(new Error('Invalid gateway'));
  }
};

export default {
  getPaymentFormSettings,
  paymentNotification,
  processOrderPayment
};
