import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Popconfirm, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import TagAction from '@components/TagAction';

import './ActionCell.scss';

import { t } from 'i18next';
import { withTranslation } from 'react-i18next';

function ActionCell({ permission, ...props }) {
  const { linkToView, viewText, viewIcon, viewColor, handleView } = props;
  const { linkToEdit, editText, editIcon, editColor, handleEdit, disabledEdit } = props;
  const { handleDelete, deleteText, deleteIcon, deleteColor, disabledDelete, confirmDelete, deleteButtonProps } = props;
  const { title, okText, cancelText, value } = props;
  const { prefix, suffix } = props;

  const allowView = permission?.read;
  const allowEdit = permission?.update;
  const allowDelete = permission?.delete;

  const deleteButton = <TagAction
    label={t(deleteText)}
    color={deleteColor}
    onClick={(event) => {confirmDelete ? null : handleDelete(value), event.stopPropagation()}}
    icon={deleteIcon}
    disabled={disabledDelete}
  />;

  function renderLinkToEditOrUpdate() {
    if (allowEdit) {
      const editStyle = {
        label: t(editText),
        icon: editIcon,
        color: editColor,
        disabled: disabledEdit,
        onClick: () => !!handleEdit ? handleEdit(value) : null,
        linkTo: linkToEdit,
      };
      return <TagAction {...editStyle} />;
    }
    if (allowView) {
      const handleViewOrEdit = handleView || handleEdit;
      return <TagAction
        label={t(viewText)}
        icon={viewIcon}
        color={viewColor}
        onClick={() => handleViewOrEdit(value)}
        linkTo={linkToView || linkToEdit}
      />;
    }
  }

  return <div className="action-cell">
    {prefix}

    {renderLinkToEditOrUpdate()}

    {!disabledDelete && allowDelete && confirmDelete && <Popconfirm
      key={value._id + value._id} title={t(title)}
      onConfirm={() => handleDelete(value)}
      cancelText={t(cancelText)} okText={t(okText)} okButtonProps={deleteButtonProps}>
      {deleteButton}
    </Popconfirm>}

    {(allowDelete && (disabledDelete || !confirmDelete)) && deleteButton}

    {suffix}
  </div>;
}

export default withTranslation()(ActionCell);

ActionCell.propTypes = {
  handleEdit: PropTypes.func,
  allowEdit: PropTypes.bool,
  disabledEdit: PropTypes.bool,
  linkToEdit: PropTypes.string,
  handleDelete: PropTypes.func,
  allowDelete: PropTypes.bool,
  disabledDelete: PropTypes.bool,
  confirmDelete: PropTypes.bool,
  deleteText: PropTypes.string,
  title: PropTypes.string,
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  value: PropTypes.object,
  editText: PropTypes.string,
  editIcon: PropTypes.any,
  viewColor: PropTypes.string,

  linkToView: PropTypes.string,
  viewIcon: PropTypes.any,
  viewText: PropTypes.string,
  editColor: PropTypes.string,
};

ActionCell.defaultProps = {
  handleEdit: null,
  allowEdit: true,
  disabledEdit: false,
  linkToEdit: null,
  handleDelete: null,
  allowDelete: true,
  disabledDelete: false,
  confirmDelete: true,
  deleteText: 'XOA',
  title: 'XOA_DU_LIEU',
  okText: 'XOA',
  cancelText: 'HUY',
  value: {},
  editText: 'CHINH_SUA',
  editIcon: <EditOutlined/>,
  viewColor: 'geekblue',
  linkToView: null,
  viewIcon: <EyeOutlined/>,
  editColor: 'cyan',
  viewText: 'CHI_TIET',

  deleteIcon: <DeleteOutlined/>,
  deleteColor: 'red',
  deleteButtonProps: { type: 'danger' },
};
