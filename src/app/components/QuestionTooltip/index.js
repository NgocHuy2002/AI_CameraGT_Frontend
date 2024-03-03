import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';

function QuestionTooltip({ title, placement }) {
  return <>
    <Tooltip title={title} placement={placement}>
      <i className="fas fa-question-circle tooltip-icon"/>
    </Tooltip>
  </>;
}

export default (QuestionTooltip);

QuestionTooltip.propTypes = {
  title: PropTypes.string,
  placement: PropTypes.string,
};

QuestionTooltip.defaultProps = {
  title: '',
  placement: 'top',
};
