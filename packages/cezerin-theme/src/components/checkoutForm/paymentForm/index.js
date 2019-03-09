import React from 'react';
import api from '../../../lib/api';
import PayPalCheckout from './PayPalCheckout';
import LiqPay from './LiqPay';
import StripeElements from './StripeElements';
import StripeBancontact from './StripeBancontact';

export default class PaymentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formSettings: null,
      loading: false
    };
  }

  componentDidMount() {
    this.fetchFormSettings();
  }

  componentWillReceiveProps(nextProps) {
    const { gateway, amount } = this.props;
    if (nextProps.gateway !== gateway || nextProps.amount !== amount) {
      this.fetchFormSettings();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { gateway, amount } = this.props;
    return (
      nextProps.gateway !== gateway ||
      nextProps.amount !== amount ||
      this.state !== nextState
    );
  }

  fetchFormSettings = () => {
    this.setState({
      loading: true
    });

    api.ajax.paymentFormSettings
      .retrieve()
      .then(({ json }) => {
        this.setState({
          formSettings: json,
          loading: false
        });
      })
      .catch(e => {
        this.setState({
          formSettings: null,
          loading: false
        });
        console.log(e);
      });
  };

  render() {
    const { gateway, shopSettings, onPayment, onCreateToken } = this.props;
    const { formSettings, loading } = this.state;

    if (loading) {
      return null;
    }

    if (formSettings && gateway && gateway !== '') {
      switch (gateway) {
        case 'paypal-checkout':
          return (
            <div className="payment-form">
              <PayPalCheckout formSettings={formSettings} shopSettings={shopSettings} onPayment={onPayment} />
            </div>
          );
        case 'liqpay':
          return (
            <div className="payment-form">
              <LiqPay formSettings={formSettings} shopSettings={shopSettings} onPayment={onPayment} />
            </div>
          );
        case 'stripe-elements':
          return (
            <div className="payment-form">
              <StripeElements
                formSettings={formSettings}
                shopSettings={shopSettings}
                onPayment={onPayment}
                onCreateToken={onCreateToken}
              />
            </div>
          );
        case 'stripe-bancontact':
          return (
            <div className="payment-form">
              <StripeBancontact
                formSettings={formSettings}
                shopSettings={shopSettings}
                onPayment={onPayment}
                onCreateToken={onCreateToken}
              />
            </div>
          );
        default:
          return (
            <div>
              Payment Gateway <b>{gateway}</b> not found!
            </div>
          );
      }
    } else {
      return null;
    }
  }
}
