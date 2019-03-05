import React from 'react';
import { injectStripe } from 'react-stripe-elements';

class CheckoutForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inProgress: false
    };
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    const {
      onCreateToken,
      shopSettings: { paymentPending }
    } = this.props;

    if (paymentPending != null && paymentPending.parsedLocation != null) {
      this.setState({ inProgress: true });
      setTimeout(() => {
        const { stripe } = this.props;
        stripe
          .retrieveSource({
            id: paymentPending.parsedLocation.source,
            client_secret: paymentPending.parsedLocation.client_secret
          })
          .then(result => {
            if (result.source.status === 'chargeable') {
              onCreateToken(result.source.id);
            } else {
              alert('Was not able to bill you.');
            }
          });
      }, 2000);
    }
  }

  async submit() {
    this.setState({ inProgress: true });
    const {
      formSettings: { amount, email },
      stripe,
      shopSettings
    } = this.props;
    const { source } = await stripe.createSource({
      type: 'bancontact',
      amount: amount * 100,
      currency: shopSettings.currency_code.toLowerCase(),
      owner: {
        name: email,
        email
      },
      redirect: {
        return_url: window.location.href
      },
      statement_descriptor: 'Stripe Payments Demo'
    });
    if (source.redirect.url != null) {
      window.location.replace(source.redirect.url);
    }
  }

  render() {
    const { inProgress } = this.state;
    return (
      <div>
        <div className="checkout-button-wrap">
          <button
            type="button"
            onClick={this.submit}
            disabled={inProgress}
            className={`checkout-button button is-primary${
              inProgress ? ' is-loading' : ''
            }`}
          >
            Naar Bancontact
          </button>
        </div>
      </div>
    );
  }
}
export default injectStripe(CheckoutForm);
