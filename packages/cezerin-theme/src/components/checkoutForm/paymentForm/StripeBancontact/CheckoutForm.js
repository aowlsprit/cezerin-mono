import React from 'react';
import { injectStripe } from 'react-stripe-elements';

class CheckoutForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inProgress: false,
      stripeStatus: null
    };
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    const {
      shopSettings: { paymentPending },
      onPayment
    } = this.props;

    if (paymentPending != null && paymentPending.parsedLocation != null) {
      this.setState({ inProgress: true });
      const pollPayment = setInterval(() => {
        const { stripe } = this.props;
        const sourceId =
          typeof paymentPending.parsedLocation.source === 'string'
            ? paymentPending.parsedLocation.source
            : paymentPending.parsedLocation.source.pop();
        const clientSecret =
          typeof paymentPending.parsedLocation.client_secret === 'string'
            ? paymentPending.parsedLocation.client_secret
            : paymentPending.parsedLocation.client_secret.pop();
        stripe
          .retrieveSource({
            id: sourceId,
            client_secret: clientSecret
          })
          .then(result => {
            console.log(result.source.status);
            if (result.source.status === 'consumed') {
              clearInterval(pollPayment);
              onPayment();
            } else {
              clearInterval(pollPayment);
              this.setState({ stripeStatus: 'Payment failed' });
              this.setState({ inProgress: false });
            }
          });
      }, 1000);
    }
  }

  async submit() {
    this.setState({ inProgress: true });
    const { formSettings, stripe, shopSettings } = this.props;
    const { amount, email, order_id: orderId } = formSettings;

    const { source } = await stripe.createSource({
      type: 'bancontact',
      amount: amount * 100,
      currency: shopSettings.currency_code.toLowerCase(),
      owner: {
        name: email,
        email
      },
      metadata: {
        orderId
      },
      redirect: {
        return_url: window.location.href
      },
      statement_descriptor: `#${email}-${orderId}`
    });
    if (source.redirect.url != null) {
      window.location.replace(source.redirect.url);
    }
  }

  render() {
    const { inProgress, stripeStatus } = this.state;
    return (
      <div>
        <div className="checkout-button-wrap">
          <button
            type="button"
            onClick={this.submit}
            disabled={inProgress}
            className={`checkout-button button is-primary${inProgress ? ' is-loading' : ''}`}
          >
            Naar Bancontact
          </button>
          <p> {stripeStatus} </p>
        </div>
      </div>
    );
  }
}
export default injectStripe(CheckoutForm);
