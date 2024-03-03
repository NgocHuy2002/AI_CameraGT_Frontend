import React from 'react';
import { Col, Pagination, Row } from 'antd';
import { useTranslation } from 'react-i18next';

import Loading from '@components/Loading';
import Ratio from '@components/Ratio';

function ListCaptureCamera({ ...props }) {
  const { filterSelected, setFilterSelected } = props;
  const { pageSizeNumber, loadingCapture } = props;
  const listImage = props.arrImg?.data ? props.arrImg?.data : [];
  const { t } = useTranslation();

  function onChangePage(pageState) {
    setFilterSelected({ ...filterSelected, page: pageState });
  }

  return (
    <Loading active={loadingCapture}>
      <Row gutter={15} className="image-list-camera">
        {listImage.length > 0 && listImage.map((item, index) =>
          <Col key={index} xs={4} className="image-list-camera__item">
            <div className="image-list-camera__image"
                 onClick={() => {
                   props.setStateImgDetail({
                     isShowModal: true,
                     id: item?._id,
                     imgSelected: item,
                   });
                 }}>
              <Ratio type="4:3">
                <img className="w-100 h-100" src={item?.imgUri} alt=""/>
              </Ratio>
            </div>
          </Col>,
        )}
      </Row>
      <Row justify="end" className="mt-2">
        {props.arrImg?.total > 10 && (<>
            <Pagination
              pageSize={pageSizeNumber}
              total={props.arrImg?.total}
              showSizeChanger={false}
              current={filterSelected.page}
              onChange={onChangePage}
              showTotal={(total, range) => `${range[0]}-${range[1]} ${t('CUA')} ${total}`}
            />
          </>
        )}
      </Row>
      {listImage.length === 0 && loadingCapture === false && <p style={{ textAlign: 'center' }}>{t('KHONG_CO_ANH')}</p>}
    </Loading>
  );
}

export default ListCaptureCamera;
