import React from 'react';
import { Col, Row } from 'antd';
import PropTypes from 'prop-types';

export default function ItemLabel({ className, label, xs, sm, md, lg, xl, xxl, mb, labelLeft, ...props }) {
  return <Row className={`ant-form-item${className ? ` ${className}` : ''}${mb ? ` ${mb}` : ''}`}>
    <Col
      xs={xs} sm={sm} md={md} lg={lg} xl={xl} xxl={xxl}
      style={{ fontSize: 12 }}
      className={`ant-form-item-label ${labelLeft ? 'ant-form-item-label-left' : ''}`}>
      {!!label && <label>{label}</label>}
    </Col>
    <Col className="ant-col ant-form-item-control" style={{ alignSelf: 'center' }}>
      <div>{props.children}</div>
    </Col>
  </Row>;
}

ItemLabel.propTypes = {
  xs: PropTypes.number,
  sm: PropTypes.number,
  md: PropTypes.number,
  lg: PropTypes.number,
  xl: PropTypes.number,
  xxl: PropTypes.number,
  mb: PropTypes.string,
  labelLeft: PropTypes.bool,
};

ItemLabel.defaultProps = {
  xs: 8,
  sm: 8,
  md: 8,
  lg: 5,
  xl: 6,
  xxl: 6,
  mb: 'mb-2',
  labelLeft: true,
};
