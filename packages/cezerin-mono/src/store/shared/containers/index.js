import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { mapStateToProps, mapDispatchToProps } from '../containerProps';
import { IndexContainer } from '@aowlsprit/cezerin-theme';

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(IndexContainer)
);