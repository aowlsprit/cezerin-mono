import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { CheckoutSuccessContainer } from '@aowlsprit/cezerin-theme';
import { mapStateToProps, mapDispatchToProps } from '../containerProps';

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CheckoutSuccessContainer)
);
