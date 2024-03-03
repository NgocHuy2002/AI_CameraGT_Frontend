import React from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';

export default function CustomButton({ isCancel, icon, imgSrc, title, className, ...props }) {
  let classNameString = 'd-flex btn';
  if (isCancel) classNameString += ' btn-cancel';
  if (className) classNameString += ` ${className}`;
  return (
    <Button
      {...props}
      className={classNameString}
      htmlType="submit"
      type="primary"
    >
      <div className={`btn__icon ${icon || imgSrc ? '' : 'm-0'}`}>
        {icon
          ? icon
          : imgSrc
            ? <img src={imgSrc} alt=""/>
            : null}
      </div>
      <span className="btn__title">{title}</span>
    </Button>
  );
}


CustomButton.propTypes = {
  className: PropTypes.string,
  isCancel: PropTypes.bool,
};

CustomButton.defaultProps = {
  className: '',
  isCancel: false,
};

