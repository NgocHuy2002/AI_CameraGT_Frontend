import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Col, Collapse, DatePicker, Form, Input, InputNumber, Row, Select, Skeleton, Popover, Tooltip, AutoComplete } from 'antd';
import { CaretDownOutlined, CaretRightOutlined, CaretUpOutlined, ClearOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { delay } from 'lodash';

import { CONSTANTS, FILTER_THOI_GIAN_OPTIONS } from '@constants';
import {
  cloneObj,
  convertMoment,
  convertQueryToObject,
  formatQueryOneDay,
  momentValid,
  removeAccents,
} from '@app/common/functionCommons';

import '../Filter/Filter.scss';
import { t } from 'i18next';
import { withTranslation } from 'react-i18next';
import moment from 'moment';

const FILTER_PREFIX = 'filter_';

function Filter({ ...props }) {
  const { loading, clearWhenChanged, clearWhenRemove, onSearchChange, formLayout, layoutRow, layoutCol, labelCol, marginCollapsed, showHeader, changeWhenTimeLack } = props;
  const { showSkeleton } = props;
  const [formFilter] = Form.useForm();

  const [isCollapse, setCollapse] = useState(props.expandWhenStarting);
  const [isChanged, setChanged] = useState(false);

  const [isOptionalTime, setOptionalTime] = useState(false);

  function handleDataSearch() {
    const dataHandled = [...props.dataSearch];
    const timeIndex = dataHandled.findIndex(search => search.type === CONSTANTS.TIME_OPTIONS);
    if (isOptionalTime && timeIndex !== -1) {
      const { fieldNames } = dataHandled[timeIndex];
      dataHandled.splice(timeIndex + 1, 0, {
        label: fieldNames?.to?.label || t('DEN_NGAY'),
        name: fieldNames?.to?.value || `denNgay`,
        type: CONSTANTS.DATE,
      });
      dataHandled.splice(timeIndex + 1, 0, {
        label: fieldNames?.from?.label || t('TU_NGAY'),
        name: fieldNames?.from?.value || `tuNgay`,
        type: CONSTANTS.DATE,
      });
    }
    return dataHandled;
  }

  const dataFilter = handleDataSearch();

  useEffect(() => {
    if (props.resetFilter !== 0) {
      clearSearch();
      setChanged(false);
    }
  }, [props.resetFilter]);

  useEffect(() => {
    dataFilter.forEach(data => {
      if (data.defaultValue) {
        const checkExist = formFilter.getFieldsValue()[`${FILTER_PREFIX}${data.name}`];
        if (!checkExist) {
          formFilter.setFieldsValue({ [`${FILTER_PREFIX}${data.name}`]: data.defaultValue });
        }
      }
    });
  }, [dataFilter]);

  useEffect(() => {
    if (props.history?.location?.search) {
      const queryObj = convertQueryToObject(props.history.location.search);
      delete queryObj.page;
      delete queryObj.limit;
      if (Object.values(queryObj).length) {
        formFilter.resetFields();
        Object.entries(queryObj).forEach(([key, value]) => {
          value = checkMomentValid(value) ? convertMoment(value) : value;
          formFilter.setFieldsValue({ [`${FILTER_PREFIX}${key}`]: value });
          if (value === CONSTANTS.TIME_OPTIONS) {
            setOptionalTime(true);
          }
        });
        delay(() => {
          setCollapse(true);
        }, 500);
      }
    }
  }, [changeWhenTimeLack]);

  function checkMomentValid(value) {
    const first = moment(new Date("1900-01-01"));
    const last = moment(new Date("2100-01-01"));
    if (!momentValid(value)) return false;
    const momentValue = convertMoment(value);
    return (momentValue >= first && momentValue <= last);
  }


  function setDataDefault() {
    const dataField = {};
    dataFilter.forEach(data => {
      if (data.type === CONSTANTS.AUTO_COMPLETE) {
        dataField[`${FILTER_PREFIX}${data.name}`] = data.defaultValue || '';
      } else dataField[`${FILTER_PREFIX}${data.name}`] = data.defaultValue || undefined;
    });
    formFilter.setFieldsValue(dataField);
    if (onSearchChange) {
      onSearchChange(dataField);
    }
    if (isOptionalTime) setOptionalTime(false);
  }

  function renderFilterText(data) {
    return <Input
      placeholder={data.placeholder || data.label}
      disabled={loading || data.disabled}
      allowClear
      {...data.defaultValue ? { defaultValue: data.defaultValue } : null}
    />;
  }

  function renderFilterNumber(data) {
    return <InputNumber
      placeholder={data.placeholder || data.label}
      disabled={loading || data.disabled}
      allowClear style={{ width: '100%' }}
      {...data.defaultValue ? { defaultValue: data.defaultValue } : null}
    />;
  }

  function renderFilterTime(data) {
    return <Select
      placeholder={data.placeholder || `${t('TAT_CA')} ${data.label?.toLowerCase()}`} disabled={loading || data.disabled}
      dropdownClassName="small"
      allowClear showSearch
      filterOption={(input, option) => removeAccents(option.children?.toLowerCase()).includes(removeAccents(input.toLowerCase()))}
      {...data.defaultValue ? { defaultValue: data.defaultValue } : null}
      onChange={e => {
        if (e === CONSTANTS.TIME_OPTIONS && !isOptionalTime) {
          setOptionalTime(true);
        } else if (e !== CONSTANTS.TIME_OPTIONS && isOptionalTime) {
          setOptionalTime(false);
        }
      }}
    >
      {FILTER_THOI_GIAN_OPTIONS.map(option => {
        return <Select.Option key={option.value} value={option.value}>
          {t(option.label) || option.label}
        </Select.Option>;
      })}
    </Select>;
  }

  function renderFilterSelect(data) {
    let showArrow = true;
    if (data.showArrow !== undefined) showArrow = data.showArrow;
    return <Select
      placeholder={data.placeholder || `${t('TAT_CA')} ${data.label?.toLowerCase()}`} disabled={loading || data.disabled}
      dropdownClassName="small"
      allowClear showSearch
      onSearch={data.onSearch}
      onChange={data.onChange}
      onFocus={data.onFocus}
      notFoundContent={data.notFoundContent}
      showArrow={showArrow}
      filterOption={(input, option) => removeAccents(option.children?.toLowerCase()).includes(removeAccents(input.toLowerCase()))}
      {...data.defaultValue ? { defaultValue: data.defaultValue } : null}
    >
      {Array.isArray(data.options) && data.options.map(option => {
        return <Select.Option key={option.value} value={option.value}>
          {t(option.code) || t(option.value) || t(option.label) || option.label}
        </Select.Option>;
      })}

      {(typeof data.options === 'object' && Array.isArray(data.options.data))
        && data.options.data.map(option => {
          if (option) {
            return <Select.Option
              key={option[data.options?.valueString] || option.value || option.code}
              value={option[data.options?.valueString] || option.value || option.code}>
              {option[data.options?.labelString] || t(option.code) || t(option.value)}
            </Select.Option>;
          }
        })}
    </Select>;
  }

  function renderFilterMultiSelect(data) {
    return <Select
      placeholder={data.placeholder || `${t('CHON')} ${data.label}`}
      disabled={loading || data.disabled}
      dropdownClassName="small"
      allowClear mode="multiple"
      {...data.defaultValue ? { defaultValue: data.defaultValue } : null}
    >
      {Array.isArray(data.options) && data.options.map(option => {
        return <Select.Option key={option.value} value={option.value}>
          {option.label}
        </Select.Option>;
      })}
    </Select>;
  }
  const [selectedDateFrom, setSelectedDateFrom] = useState(null);
  const [selectedDateTo, setSelectedDateTo] = useState(null);

  function renderFilterDate(data) {
    return <DatePicker
      size="small" style={{ width: '100%' }} format="DD/MM/YYYY HH:mm"
      placeholder={data.placeholder || `${t('CHON')} ${data.label}`}
      disabled={loading || data.disabled}
      dropdownClassName="small"
      {...data.defaultValue ? { defaultValue: data.defaultValue } : null}
      {...data.showTime ? { showTime: data.showTime } : null}
      {...data.minuteStep ? { minuteStep: data.minuteStep } : null}
    />;
  }

  function renderFilterRanger(data) {

    const disabledDate = current => {
      if (selectedDateTo && !selectedDateFrom) {
        return (
          (current && selectedDateTo && current.diff(selectedDateTo, 'days') > 0) ||
          (selectedDateTo && current.diff(selectedDateTo, 'days') < -30)
        );
      }
      return (
        (current && selectedDateFrom && current.diff(selectedDateFrom, 'days') > 30) || 
        (selectedDateFrom && current.diff(selectedDateFrom, 'days') < 0) 
      );
    };

    const handleDateChange = date => {
      if (data.name === 'tu_ngay') {
        setSelectedDateFrom(date);
      }
      else {
        setSelectedDateTo(date)
      }
    };
    return <DatePicker
      size="small" style={{ width: '100%' }} format="DD/MM/YYYY"
      placeholder={data.placeholder || `${t('CHON')} ${data.label}`}
      disabled={loading || data.disabled}
      dropdownClassName="small"
      allowClear={true}
      {...data.defaultValue ? { defaultValue: data.defaultValue } : null}
      {...data.value ? { value: data.value } : null}
      disabledDate={disabledDate}
      onChange={handleDateChange}
    />;
  }

  function renderFilterAutoComplete(data) {
    return <AutoComplete
      allowClear={data.allowClear}
      placeholder={data.placeholder}
      disabled={loading || data.disabled}
      onSearch={data.onSearch}
      options={data.options}
      notFoundContent={data.notFoundContent}
      filterOption={(inputValue, option) => option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
      {...data.defaultValue ? { defaultValue: data.defaultValue } : null}
    />
  }

  function clearSearch() {
    setDataDefault();
    setSelectedDateFrom();
    setSelectedDateTo();
    props.clearSearch();
    if (!isChanged) setChanged(true);
  }

  function filter(values) {
    const query = {};
    dataFilter.forEach(item => {
      Object.entries(values).forEach(([key, value]) => {
        const filterKey = key.replace(FILTER_PREFIX, '');
        if (filterKey === item.name && value) {
          switch (item.type) {
            case CONSTANTS.TEXT:
            case CONSTANTS.SELECT:
            case CONSTANTS.AUTO_COMPLETE:
            case CONSTANTS.TIME_OPTIONS:
              query[filterKey] = value;
              break;
            case CONSTANTS.ONE_DAY:
              query[filterKey] = formatQueryOneDay(value);
              break;
            case CONSTANTS.MULTI_SELECT:
            case CONSTANTS.NUMBER:
              query[filterKey] = [value];
              break;
            default:
              query[filterKey] = [value];
              break;
          }
        }
      });
    });
    setChanged(false);
    if (props.handleFilter) {
      props.handleFilter(query);
    }
  }

  function onValuesChange(changedValues, allValues) {
    if (!isChanged) {
      setChanged(true);
    }
    if (onSearchChange) {
      changedValues = Object.keys(changedValues).reduce((prevValue, key) => {
        prevValue[key.replace(FILTER_PREFIX, '')] = changedValues[key];
        return prevValue;
      }, {});
      allValues = Object.keys(allValues).reduce((prevValue, key) => {
        prevValue[key.replace(FILTER_PREFIX, '')] = allValues[key];
        return prevValue;
      }, {});
      onSearchChange(cloneObj(changedValues), cloneObj(allValues));
    }
    if (clearWhenChanged) {
      Object.keys(changedValues).forEach(key => {
        clearWhenChanged.forEach(item => {
          if (key === item.change) {
            const fieldReset = [];
            if (Array.isArray(item.clear)) {
              item.clear.forEach(reset => {
                fieldReset.push(`${FILTER_PREFIX}${reset}`);
              });
            } else {
              fieldReset.push(`${FILTER_PREFIX}${item.clear}`);
            }
            formFilter.resetFields(fieldReset);
          }
        });
      });
    }
    if (clearWhenRemove) {
      Object.entries(changedValues).forEach(([key, value]) => {
        clearWhenRemove.forEach(item => {
          if (key === item.change && (!value)) {
            const fieldReset = [];
            if (Array.isArray(item.clear)) {
              item.clear.forEach(reset => {
                fieldReset.push(`${FILTER_PREFIX}${reset}`);
              });
            } else {
              fieldReset.push(`${FILTER_PREFIX}${item.clear}`);
            }
            formFilter.resetFields(fieldReset);
          }
        });
      });
    }
  }

  function renderHeader() {
    if (!showHeader) return null;
    return <Button type="primary" size="small" className="mb-2" onClick={() => setCollapse(!isCollapse)}> {t('BO_LOC')}
      {isCollapse ? <CaretUpOutlined /> : <CaretDownOutlined />}</Button>;
  }

  function renderLabel(search) {
    if (search.type === CONSTANTS.TIME_OPTIONS && search.isBaoCao) {
      return <>
        {search.label}
        <Tooltip
          color="cyan"
          title={t('XEM_CHI_TIET')}
        >
          {RenderPopover(search)}
        </Tooltip>
      </>;
    }
    else return search.label;
  }

  function RenderPopover(search) {
    return <Popover
      trigger='click'
      placement='bottom'
      title={
        <div>
          <b><u>{search.label}:</u></b>
          {search.labelDetail && (t('LA') + search.labelDetail.toLowerCase())}
        </div>
      }
      content={
        <div className='toolTip-content'>
          <div>
            <b>{t('THANG_HIEN_TAI')}</b>
            {t('MO_TA_THANG_HIEN_TAI')}
          </div>
          <div>
            <b>{t('QUY_HIEN_TAI')}</b>
            {t('MO_TA_QUY_HIEN_TAI')}
          </div>
          <div>
            <b>{t('NAM_HIEN_TAI')}</b>
            {t('MO_TA_NAM_HIEN_TAI')}
          </div>
          <div>
            <b>{t('TUY_CHON')}</b>
            {search.fieldNames
              ? t('MO_TA_TUY_CHON_CO_FIELDNAME').format(search.fieldNames?.from?.label, search.fieldNames?.to?.label)
              : t('MO_TA_TUY_CHON')}
          </div>
        </div>
      }>
      <QuestionCircleOutlined className='icon-question-label' />
    </Popover>
  }

  return (
    <Collapse
      ghost
      className={`filter-header ${(!isCollapse && marginCollapsed) ? 'mb-2' : ''}`}
      activeKey={isCollapse ? '1' : ''}
      expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
    >
      <Collapse.Panel
        showArrow={false}
        className="p-0"
        header={renderHeader()}
        key="1">
        <Form form={formFilter} id="form-filter" autoComplete="off" size="small" colon={false} layout={formLayout || 'horizontal'}
          onValuesChange={onValuesChange}
          onFinish={filter}>
          <Row>
            {dataFilter.map((search, index) => {
              let xhtml;
              switch (search.type) {
                case CONSTANTS.TEXT:
                  xhtml = renderFilterText(search);
                  break;
                case CONSTANTS.SELECT:
                  xhtml = renderFilterSelect(search);
                  break;
                case CONSTANTS.MULTI_SELECT:
                  xhtml = renderFilterMultiSelect(search);
                  break;
                case CONSTANTS.DATE:
                case CONSTANTS.ONE_DAY:
                  xhtml = renderFilterDate(search);
                  break;
                case CONSTANTS.RANGER:
                  xhtml = renderFilterRanger(search);
                  break;
                case CONSTANTS.NUMBER:
                  xhtml = renderFilterNumber(search);
                  break;
                case CONSTANTS.TIME_OPTIONS:
                  xhtml = renderFilterTime(search);
                  break;
                case CONSTANTS.AUTO_COMPLETE:
                  xhtml = renderFilterAutoComplete(search);
                  break;
                default:
                  xhtml = search.render;
                  break;
              }

              if (xhtml) {
                const labelColItem = search.labelCol || labelCol;
                const wrapperColItem = {};
                Object.entries(labelColItem).forEach(([key, value]) => {
                  wrapperColItem[key] = value === 24 ? 24 : 24 - value;
                });
                let countCol = {};
                Object.keys(layoutCol).forEach(key => countCol[key] = 0);

                for (let i = 0; i < dataFilter.length - 1; i++) {
                  if (i < index) {
                    const layoutColCurrent = dataFilter[i].layoutCol || layoutCol;
                    const layoutColNext = dataFilter[i + 1].layoutCol || layoutCol;

                    Object.keys(countCol).forEach(key => {
                      countCol[key] = (countCol[key] + layoutColCurrent[key] + layoutColNext[key]) > 24 ? 0 : (countCol[key] + layoutColCurrent[key]);
                      countCol[key] = countCol[key] % 24;
                    });
                  }
                }

                let className = '';
                Object.entries(countCol).forEach(([key, value]) => {
                  className += className ? ' ' : '';
                  className += `pl-${key}-${value % 24 ? 3 : 0}`;
                });

                return <Col {...(search.layoutCol || layoutCol)} key={search.name} className={className}>
                  <Form.Item
                    labelCol={labelColItem}
                    wrapperCol={wrapperColItem}
                    label={renderLabel(search)}
                    name={FILTER_PREFIX + search.name}
                    labelAlign="left">
                    {(showSkeleton || search.showSkeleton)
                      ? <Skeleton.Input active size="small" className="w-100" />
                      : xhtml}
                  </Form.Item>
                </Col>;
              }
            })}
          </Row>
          <Col {...layoutCol} className="ml-auto" hidden={layoutRow}>
            <div className="ant-form-item d-block clearfix">
              <Button htmlType="submit" size="small" type="primary" className="pull-right"
                disabled={loading || !isChanged}
                icon={<i className="fa fa-filter mr-1 mb-2" />}>
                {t('LOC_DU_LIEU')}
              </Button>
              <Button htmlType="button" size="small" className="pull-right mr-2 mb-2" disabled={loading}
                danger
                icon={<ClearOutlined />} onClick={clearSearch}>
                {t('XOA_BO_LOC')}
              </Button>
            </div>
          </Col>
          {layoutRow ?
            <Row {...layoutCol} className="ml-auto">
              <div className="ant-form-item d-block clearfix">
                <Button htmlType="submit" size="small" type="primary" className="pull-right"
                  disabled={loading || !isChanged}
                  icon={<i className="fa fa-filter mr-1 mb-2" />}>
                  {t('LOC_DU_LIEU')}
                </Button>
                <Button htmlType="button" size="small" className="pull-right mr-2 mb-2" disabled={loading}
                  danger
                  icon={<ClearOutlined />} onClick={clearSearch}>
                  {t('XOA_BO_LOC')}
                </Button>
              </div>
            </Row> :
            null}
        </Form>
      </Collapse.Panel>
    </Collapse>
  );

}

Filter.propTypes = {
  layoutCol: PropTypes.object,
  labelCol: PropTypes.object,
  marginCollapsed: PropTypes.bool,
  expandWhenStarting: PropTypes.bool,
  clearSearch: PropTypes.func,
  showHeader: PropTypes.bool,
  showSkeleton: PropTypes.bool,
};

Filter.defaultProps = {
  layoutCol: { xs: 24, sm: 24, md: 12, lg: 12, xl: 12, xxl: 8 },
  labelCol: { xs: 24, sm: 6, md: 10, lg: 10, xl: 10, xxl: 8 },
  marginCollapsed: false,
  expandWhenStarting: false,
  clearSearch: () => null,
  showHeader: true,
  showSkeleton: false,
};

export default withTranslation()(withRouter(Filter));
