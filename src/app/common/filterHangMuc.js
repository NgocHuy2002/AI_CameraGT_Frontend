import { TreeSelect } from 'antd';
import React from 'react';
import { removeAccents } from '@app/common/functionCommons';
import { t } from 'i18next';

export default function filterHangMuc(dataTree, defaultValue) {
  if (!Array.isArray(dataTree) || !dataTree) return;

  function renderTreeNode(children) {
    if (!Array.isArray(children)) return null;
    return children.map(child => {
      return <TreeSelect.TreeNode
        key={child.key}
        value={child._id}
        title={child?.tenNoiDung || child?.tenTieuChi}
        selectable={child?.selectable}
      >
        {child.tieuChiId ? renderTreeNode(child.tieuChiId) : renderTreeNode(child.chiTiet)}
      </TreeSelect.TreeNode>;
    });
  }

  return <TreeSelect
    size="small"
    style={{ width: '100%' }}
    className="select-label"
    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
    showSearch
    placeholder={t('TAT_CA_HANG_MUC')}
    treeDefaultExpandAll
    allowClear
    filterOption={(input, option) => removeAccents(option.title?.toLowerCase()).includes(removeAccents(input.toLowerCase()))}
    {...defaultValue ? { defaultValue } : null}
  >
    {renderTreeNode(dataTree)}
  </TreeSelect>;
}
