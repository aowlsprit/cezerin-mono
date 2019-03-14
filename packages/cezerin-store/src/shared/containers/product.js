import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { ProductContainer } from '@aowlsprit/cezerin-theme';
import { mapStateToProps, mapDispatchToProps } from '../containerProps';

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ProductContainer)
);
