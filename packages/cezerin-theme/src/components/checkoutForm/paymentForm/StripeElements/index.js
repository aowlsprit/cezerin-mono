import React from 'react';
import { StripeProvider } from 'react-stripe-elements';
import StoreCheckout from './StoreCheckout';

export default class StripeElements extends React.Component {
	constructor(props) {
		super(props);
		this.state = { stripe: null };
	}

	componentDidMount() {
		const SCRIPT_URL = 'https://js.stripe.com/v3/';
		const container = document.body || document.head;
		const script = document.createElement('script');
		script.src = SCRIPT_URL;
		script.async = true;
		const { formSettings } = this.props;
		script.onload = () => {
			this.setState({
				stripe: window.Stripe(formSettings.public_key)
			});
		};
		container.appendChild(script);
	}

	render() {
		const { formSettings, shopSettings, onPayment, onCreateToken } = this.props;
		const { stripe } = this.state;
		return (
			<StripeProvider stripe={stripe}>
				<StoreCheckout
					formSettings={formSettings}
					shopSettings={shopSettings}
					onPayment={onPayment}
					onCreateToken={onCreateToken}
				/>
			</StripeProvider>
		);
	}
}
