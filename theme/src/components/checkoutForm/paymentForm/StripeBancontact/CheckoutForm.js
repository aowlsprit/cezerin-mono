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

	async submit(ev) {
		this.setState({
			inProgress: true
		});
		const { formSettings, onCreateToken, stripe } = this.props;
		console.log('>>> formSettings', formSettings);
		const { source } = await stripe.createSource({
			type: 'bancontact',
			amount: 50,
			currency: 'eur',
			owner: {
				name: 'test',
				email: 'test@test.be'
			},
			redirect: {
				return_url: window.location.href
			},
			statement_descriptor: 'Stripe Payments Demo',
			metadata: {
				order: 123123
			}
		});
		console.log('>>> source', source);
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
