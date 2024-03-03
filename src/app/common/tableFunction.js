import React, { useRef, useState } from 'react';
import { Form, Input, Checkbox, Tag, Dropdown, Menu } from 'antd';
import { SearchOutlined, FilterFilled } from '@ant-design/icons';

import { cloneObj } from '@app/common/functionCommons';
import { t } from 'i18next';

export function getColumnSearchProps() {
  return null;
}

export function searchColumnInput(queryKey, handleSearch = () => null, placeholder) {

  const [state, setState] = useState({
    filterDropdownVisible: false,
    query: '',
  });
  const inputRef = useRef();
  const formRef = useRef();

  function clearSearch() {
    handleSearch(queryKey, null);
    formRef?.current?.resetFields();
    setState({ filterDropdownVisible: false, query: '' });
  }

  function actionSearch() {
    const formValue = formRef?.current.getFieldsValue();
    handleSearch(queryKey, formValue[queryKey]);
    setState({ filterDropdownVisible: false, query: formValue[queryKey] });
  }

  return {
    filterDropdownVisible: state.filterDropdownVisible,
    filterDropdown: () => (
      <div style={{ padding: 8 }}>
        <Form ref={formRef}>
          <Form.Item name={queryKey} className="m-0">
            <Input
              ref={inputRef}
              size="small"
              placeholder={placeholder}
              onPressEnter={() => actionSearch()}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
          </Form.Item>
        </Form>
        <div className="clearfix">
          <Tag color="blue" className="tag-action pull-right m-0"
               onClick={() => actionSearch()}>
            <SearchOutlined/><span className="ml-1">{t('TIM_KIEM')}</span>
          </Tag>
          <Tag color="warning" className="tag-action pull-right mr-2"
               onClick={() => clearSearch()}>
            <span>{t('XOA_BO_LOC')}</span>
          </Tag>
        </div>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: (state.query) ? '#1890ff' : undefined }}/>,
    onFilterDropdownVisibleChange: visible => {
      setState(Object.assign({}, state, { filterDropdownVisible: visible }));
      if (visible) {
        setTimeout(() => inputRef?.current?.focus(), 100);
      }
    },
    render: text => text,

  };
}

export function searchColumnCheckbox(queryKey, handleSearch = () => null, options) {

  const [state, setState] = useState({
    filterDropdownVisible: false,
    valueSelected: [],
  });

  function clearSearch() {
    handleSearch(`${queryKey}[in]`, null);
    setState({ filterDropdownVisible: false, valueSelected: [] });
  }

  function actionSearch() {
    handleSearch(`${queryKey}[in]`, state.valueSelected);
    setState(Object.assign({}, state, { filterDropdownVisible: false }));
  }

  function handleVisibleChange(visible) {
    setState(Object.assign({}, state, { filterDropdownVisible: visible }));
  }

  function handleMenuClick(e) {
    let valueSelected = cloneObj(state.valueSelected);
    if (valueSelected.includes(e.key)) {
      valueSelected.splice(valueSelected.indexOf(e.key), 1);
    } else {
      valueSelected = [...valueSelected, e.key];
    }
    setState(Object.assign({}, state, { valueSelected }));
  }

  const menu = (
    <Menu onClick={handleMenuClick} selectedKeys={state.valueSelected}>
      {Array.isArray(options) && options.map(option => {
        return <Menu.Item key={option.value}>
          <Checkbox checked={state.valueSelected.includes(option.value)}>{option.label}</Checkbox>
        </Menu.Item>;
      })}
      <Menu.Divider/>
      <div className="clearfix" style={{ padding: '4px 8px' }}>
        <Tag color="blue" className="tag-action pull-right m-0"
             onClick={() => actionSearch()}>
          <SearchOutlined/><span className="ml-1">{t('TIM_KIEM')}</span>
        </Tag>
        <Tag color="warning" className="tag-action pull-right mr-2"
             onClick={() => clearSearch()}>
          <span>{t('XOA_BO_LOC')}</span>
        </Tag>
      </div>
    </Menu>
  );

  return {
    filterDropdownVisible: state.filterDropdownVisible,
    filterDropdown: () => <div/>,
    filterIcon: () => <Dropdown visible={state.filterDropdownVisible}
                                onVisibleChange={handleVisibleChange}
                                overlay={menu} trigger={['click']} placement="bottomRight">
      <div style={{ width: '100%', height: '100%' }}>
        <FilterFilled style={{ color: (state.query) ? '#1890ff' : undefined }}/>
      </div>
    </Dropdown>,
  };
}
