import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Card, Col, Row } from 'antd';
import moment from 'moment';
import axios from 'axios';

import Loading from '@components/Loading';
import Filter from '@components/Filter';

import { CONSTANTS } from '@constants';
import {
  convertQueryToObject,
  handleReplaceUrlSearch,
  toast
} from '@app/common/functionCommons';

import { getBlackListPercent, getVehicleQuality, getVehiclePercent } from '@app/services/Dashboard';

import BlackVehicle from './Dashboard/BlackVehicle';
import VehiclePercent from './Dashboard/VehiclePercent';
import VehicleQuality from './Dashboard/VehicleQuality';

import './TrangChu.scss';
import { t } from 'i18next';
import { withTranslation } from 'react-i18next';

function TrangChu({ isLoading, myInfo, orgUnitTree, duongDayTree, caiDatHeThong, ...props }) {

  const [changeWhenTimeLack, setChangeWhenTimeLack] = useState(false);

  const [dataBlack, setDataBlack] = useState({});
  const [dataVehicleQuality, setDataVehicleQuality] = useState({});
  const [dataVehicleByDateType, setDataVehicleByDateType] = useState([]);

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  useEffect(() => {
    (async () => {
      const { page, limit, ...queryObj } = convertQueryToObject(props.history.location.search);
      await getData(queryObj);
    })();
  }, []);

  async function getData(query) {
    if (query.unitId) delete query.unitId;
    query = {
      tuNgay: startOfDay,
      denNgay: endOfDay,
      ...query
    }
    const apiRequestAll = [
      getBlackListPercent(query),
      getVehiclePercent(query),
      getVehicleQuality(query),
    ];
    handleReplaceUrlSearch(props.history, null, null, query);
    axios.all(apiRequestAll)
      .then(axios.spread(function (apiBlack, apiVehicleQuality, apiVehicleByDateType) {
        apiBlack && setDataBlack(apiBlack);
        apiVehicleQuality && setDataVehicleQuality(apiVehicleQuality);
        apiVehicleByDateType && setDataVehicleByDateType(apiVehicleByDateType);
      }));
  }

  function handleFilter(query) {
    //Nếu từ ngày/đến ngày trống thì điền giá trị default, đẩy vào url và get value từ url ra để call api và set form.
    let change = changeWhenTimeLack;
    if (query.tuNgay) {
      query.tuNgay = moment(Date.parse(query.tuNgay)).startOf('day');
    } else {
      query.tuNgay = moment(new Date(2000, 0, 1));
      change = !changeWhenTimeLack;
    }

    if (query.denNgay) {
      query.denNgay = moment(Date.parse(query.denNgay)).endOf('day');
    } else {
      query.denNgay = moment().endOf('day');
      change = !changeWhenTimeLack;
    }
    change !== changeWhenTimeLack && setChangeWhenTimeLack(change);

    let diff = query.denNgay.diff(query.tuNgay, 'days');
    if (diff > 30) {
      toast(CONSTANTS.WARNING, t('OUT_OF_RANGER'));
    }
    else {
      getData(query);
    }
  }

  return (
    <div className="card-container">
      <Card size="small" bodyStyle={{ paddingBottom: 0 }}>
        <Filter
          showHeader={false}
          expandWhenStarting
          dataSearch={[
            {
              name: "tuNgay",
              label: t("FROM"),
              defaultValue: moment(startOfDay),
              showTime: true,
              minuteStep: 5,
              type: CONSTANTS.DATE,
            },
            {
              name: "denNgay",
              label: t("TO"),
              defaultValue: moment(endOfDay),
              showTime: true,
              minuteStep: 5,
              type: CONSTANTS.DATE,
            },
          ]}
          handleFilter={handleFilter}
          changeWhenTimeLack={changeWhenTimeLack}
        />
      </Card>

      <Loading active={isLoading}>
        <Row className="clearfix">
          <Col xs={24} xl={12}>
            <Card
              size="small"
              title={<span className="ant-card-head-title-custom">{t('Tỷ lệ nhận diện biển số đen trên toàn địa bàn').toUpperCase()}</span>}>
              <BlackVehicle dataBlack={dataBlack} />
            </Card>
          </Col>
          <Col xs={24} xl={12}>
            <Card
              size="small"
              title={<span className="ant-card-head-title-custom">{t('Tỷ lệ các loại phương tiện trên toàn địa bàn').toUpperCase()}</span>}>
              <VehiclePercent dataVehicleQuality={dataVehicleQuality} />
            </Card>
          </Col>
          <Col xs={24} xl={24}>
            <Card
              size="small"
              title={<span className="ant-card-head-title-custom">{t('Thống kê số lượng phương tiện trên toàn địa bàn').toUpperCase()}</span>}>
              {dataVehicleByDateType && <VehicleQuality dataVehicleByDateType={dataVehicleByDateType} />}
            </Card>
          </Col>
        </Row>
      </Loading>
    </div>
  )
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { myInfo } = store.user;
  const { caiDatHeThong } = store.caiDat;
  return { isLoading, myInfo, caiDatHeThong };
}

export default withTranslation()(connect(mapStateToProps)(TrangChu));
