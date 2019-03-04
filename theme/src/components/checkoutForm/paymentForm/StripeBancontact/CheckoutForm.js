import React from 'react';
import { injectStripe } from 'react-stripe-elements';

class CheckoutForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			inProgress: false
		};
		this.submit = this.submit.bind(this);

		const { shopSettings, stripe } = this.props;
		const { paymentPending } = shopSettings;

		console.log('>>> Found pendingPayment', paymentPending);

		if (paymentPending != null && paymentPending.parsedLocation != null) {
			this.state = {
				inProgress: true
			};
			setTimeout(() => {
				this.props.stripe
					.retrieveSource({
						id: paymentPending.parsedLocation.source,
						client_secret: paymentPending.parsedLocation.client_secret
					})
					.then(result => {
						console.log('>>> GOT SOURCE', result);
						console.log('>>> Charging', result);
						this.props.onCreateToken(result.source.id);
					});
			}, 2000);
		}
	}

	async submit(ev) {
		this.setState({
			inProgress: true
		});
		const { formSettings, stripe } = this.props;
		const { amount, email } = formSettings;
		const { source } = await stripe.createSource({
			type: 'bancontact',
			amount: amount * 100,
			currency: 'eur',
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
