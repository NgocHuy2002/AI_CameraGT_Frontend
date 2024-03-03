import React from 'react';
import L from 'leaflet';
import { URL } from '@url';
import { t } from 'i18next';
import { Button, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import icon from 'leaflet/dist/images/marker-icon.png';
import FullscreenControl from 'react-leaflet-fullscreen';
import { Map, Marker, TileLayer, Popup } from 'react-leaflet';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import { compose, withProps, withStateHandlers } from 'recompose';
import 'leaflet/dist/leaflet.css';
import "react-leaflet-fullscreen/dist/styles.css";

const MapLeaflet = compose(
  withProps(),
  withStateHandlers(
    () => ({
      showInfoDrawDistance: true,
    }),
  ),
)((props) => {
  const { marker } = props;
  const center = { lat: 16.05084, lng: 108.028368 };

  const [mapLayer, setMapLayer] = React.useState('SATELLITE');

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetina,
    iconUrl: icon,
    shadowUrl: iconShadow,
  });

  function renderHybirdMap(){
    return (
      <>
        <TileLayer
          url={
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          }
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <TileLayer
          url={
            'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'
          }
        />
      </>
    );
  }

  function renderBasicMap(){
    return (
      <TileLayer
        url={
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        }
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
    );
  }
  
  function handleDanDuong(item) {
    window.open(`http://maps.google.com/maps?q=${item?.latitude},${item?.longitude}`);
  }

  return (
    <div >
      <Map
        style={{ height: "calc(100vh - 150px)" }}
        center={center}
        zoom={6}
        maxZoom={17}
        scrollWheelZoom={true}
      >
        {mapLayer === 'TERRAIN' ? renderBasicMap() : renderHybirdMap()}
        <FullscreenControl position="topright"/>
        <div className="leaflet-bar leaflet-control btn-change-map" style={{ top: '8px', left: '8px' }}>
          <Button className={mapLayer === 'TERRAIN' ? 'active' : ''}
                  onClick={() => setMapLayer('TERRAIN')}>
            {t('BAN_DO')}
          </Button>
          <Button className={mapLayer === 'SATELLITE' ? 'active' : ''}
                  onClick={() => setMapLayer('SATELLITE')}>
            {t('VE_TINH')}
          </Button>
        </div>
        {
          marker?.map(item => (
            <Marker position={[item.latitude, item.longitude]}>
              <Popup style={{maxWidth: 10}}>
                <Row span={12}>
                  <Col span={24} style={{fontWeight: 'bold', fontSize: 18}}>
                    {item.data?.name || ''}
                  </Col>
                  {
                    item?.data?.type_id && (
                      <Col span={24}>
                        Hãng camera:{" "}
                        <label>{item?.data?.type_id?.brand || ''}</label>
                      </Col>
                    )
                  }
                  {
                    item?.data?.position_id && (
                      <Col span={24}>
                        Vị trí:{" "}
                        <label>{item?.data?.position_id?.name || ''}</label>
                      </Col>
                    )
                  }
                  {
                    item?.data?.unit_id && (
                      <Col span={24}>
                        Đơn vị:{" "}
                        <label>{item?.data?.unit_id?.name || ''}</label>
                      </Col>
                    )
                  }
                  <div style={{width: '100vh', display: 'flex',  marginTop: 5}}>
                    {/* <Link to={URL.CAMERA_ID.format(item?.data?._id)}>
                      <Button type="primary" size='small'>
                        Trực tiếp
                      </Button>
                    </Link> */}
                  
                    <Button style={{marginLeft: 15}} type="primary" size='small' onClick={() => handleDanDuong(item)}>
                      Dẫn đường
                    </Button>
                  </div>
                </Row>
              </Popup>
            </Marker>
          ))
        }
      </Map>
    </div>
  );
});

export default withTranslation()(MapLeaflet);
