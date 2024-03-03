import React from 'react';
import PropTypes from 'prop-types';
import { Popconfirm, Tag } from 'antd';
import { t } from 'i18next'
export default function TagConfirm({ label, ...props }) {

  const { confirmTitle, cancelText, okText, placement } = props;
  const { icon, color, onConfirm, okButtonProps } = props;
  const { isSubmit, formId, okButtonType, disabled, className } = props;

  return <Popconfirm
    title={confirmTitle}
    onConfirm={onConfirm}
    cancelText={cancelText}
    okText={okText}
    placement={placement}
    disabled={disabled}
    {...isSubmit ? { okButtonProps: { htmlType: 'submit', form: formId, type: okButtonType } } : null}
    {...okButtonProps ? { okButtonProps } : null}
  >
    <Tag className={`tab-btn tab-btn-sm ${className}`} icon={icon} color={color} disabled={disabled}>
      {label}
    </Tag>
  </Popconfirm>;
}

TagConfirm.propTypes = {
  onConfirm: PropTypes.func,
  confirmTitle: PropTypes.string,
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  placement: PropTypes.string,
  className: PropTypes.string,
};

TagConfirm.defaultProps = {
  onConfirm: () => null,
  confirmTitle: t('XAC_NHAN'),
  okText: t('XAC_NHAN'),
  cancelText: t('HUY'),
  placement: 'topLeft',
  className: '',
};
