import React from 'react';
import PropTypes from 'prop-types';
import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import { withTranslation } from 'react-i18next';
import { t } from 'i18next';

function DropdownButton({ title, loading, icon, ...props }) {
  const { menuItem } = props;

  const menu = (
    <Menu>
      {menuItem.map(item => {
        return <Menu.Item onClick={item.onClickFunc}>
         {t(item.title)}
        </Menu.Item>;
      })}
    </Menu>
  );

  return <div>
    <Dropdown overlay={menu}>
      <Button
        size="small" type="primary"
        className="mr-2"
        loading={loading}
      >
        {icon} {t(title)}
        <DownOutlined/>
      </Button>
    </Dropdown>
  </div>;

}

export default withTranslation()(DropdownButton);

DropdownButton.propTypes = {
  title: PropTypes.string,
};

DropdownButton.defaultProps = {
  title: 'ACTION',
};
