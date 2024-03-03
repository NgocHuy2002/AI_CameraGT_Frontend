import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Col, Image, Row, Tabs, Card } from 'antd';
import { useTranslation } from 'react-i18next';

import { getCameraById } from '../../../services/Camera';
import { connect } from 'react-redux';
import Loading from '@components/Loading';
import './Camera.scss';
import Ratio from '@components/Ratio';
import ImageDetail from '../ImageDetail/ImageDetail';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import CustomModal from '@components/CustomModal';

function CameraDetail({ myInfo }) {
  let { id } = useParams();
  const { t } = useTranslation();

  const [cameraInfo, setCameraInfo] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDataCameraID();
  }, []);

  const style = {
    padding: '8px 0',
    innerHeight: 100
  };

  function SettingCard({ label, children }) {
    const title = <div className="ant-card-head-title-custom require-field">{label}</div>;
    return <Card size="small" title={title}>
      {children}
    </Card>;
  }

  async function getDataCameraID() {
    setLoading(true);
    const apiResponse = await getCameraById(id);
    if (apiResponse) {
      setCameraInfo(apiResponse);
      setLoading(false);
    }
  }

  function handleFullScreenClick() {
    // Programmatically trigger the click event of the <Image>
    document.getElementById('cameraView').click();
  };

  return (
    <>
      <div className="site-layout-background">
        <Loading active={loading}>
          <SettingCard label={t('Thông tin camera')}>
            <Row gutter={16}>
              <Col className="gutter-row" span={8}>
                <div style={style}>
                  <div><b>{t('CAMERA')}</b>: {cameraInfo.name}</div>
                  <div><b>{t('CAMERA_TYPE')}</b>: {cameraInfo.typeId?.name}</div>
                  <div><b>{t('BRAND_CAMERA')}</b>: {cameraInfo.typeId?.brand}</div>
                  {/* <div><b>{t('TIME_SEND_FRAME')}</b>: {cameraInfo.timeSendFrame} (giây)</div> */}
                  <div><b>{t('STATUS')}</b>: {cameraInfo.status === true ? 'Hoạt động' : 'Không hoạt động'}</div>
                </div>
              </Col>
              {
                (myInfo.isSystemAdmin || (myInfo?.roleId && myInfo?.roleId[0] && myInfo?.roleId[0]?.code && (myInfo?.roleId[0]?.code === 'ADMIN'))) &&
                <Col className="gutter-row" span={8}>
                  <div style={style}>
                    <div><b>{t('CAMERA_ACCOUNT')}</b>: {cameraInfo.username}</div>
                    <div><b>{t('CAMERA_PASS')}</b>: {cameraInfo.password}</div>
                  </div>
                </Col>
              }
              {
                (myInfo.isSystemAdmin) &&
                <Col className="gutter-row" span={8}>
                  <div style={style}>
                    <div><b>{t('IP_ADDRESS')}</b>: {cameraInfo.ipAddress}</div>
                    <div><b>{t('DOMAIN')}</b>: {cameraInfo.domain}</div>
                    <div><b>{t('PORT')}</b>: {cameraInfo.port}</div>
                  </div>
                </Col>
              }
              <Col className="gutter-row" span={8}>
                <div style={style}>
                  <div><b>{t('UNIT_NAME')}</b>: {cameraInfo.unitId?.name}</div>
                  <div><b>{t('POSITION_NAME')}</b>: {cameraInfo.positionId?.name}</div>
                </div>
              </Col>
            </Row>
          </SettingCard>

          {
            !myInfo.isSystemAdmin &&
            <SettingCard label={t('WATCH_LIVE')}>
              <div className="d-flex">
                <div className="camera-view" style={{ position: 'relative' }} >
                  <Image
                    id='cameraView'
                    width={'100%'}
                    height={'100%'}
                    src={`${cameraInfo.domain}`}
                    // src="http://10.10.20.51:9298/api/video_feed"
                    // src="https://tcamera.thinklabs.com.vn/api/file/previewWarningImage/detected_2023-11-20T06-50-44.693Z.jpg"
                  />
                  <div style={{ position: 'absolute', top: '95%', left: '98%' }}>
                    <FullscreenOutlined onClick={handleFullScreenClick} />
                  </div>
                </div>
              </div>
            </SettingCard>
          }

          {
            myInfo.isSystemAdmin &&
            <SettingCard label={t('Vẽ vùng nhận dạng')}>
              <ImageDetail
                style={{ height: '100%' }}
                id={id}
                cameraInfo={cameraInfo}
              />
            </SettingCard>
          }
        </Loading>
      </div>
    </>
  );
}

function mapStateToProps(store) {
  const { myInfo } = store.user;
  return { myInfo };
}

export default connect(mapStateToProps, null)(CameraDetail);
