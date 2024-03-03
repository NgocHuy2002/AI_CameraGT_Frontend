import React from 'react';
import { connect } from 'react-redux';

import DropzoneImage from '@components/DropzoneImage';
import Ratio from '@components/Ratio';
import { t } from 'i18next';
import { withTranslation } from 'react-i18next';

function AnhDinhKem({ avatarUrl, chuKyUrl, allowChange, ...props }) {

  return (<>
      <div className="attach-image">
        <div className="attach-image__title">
          {t('ANH_DAI_DIEN')}
        </div>
        <div className="attach-image__img">
          <DropzoneImage
            width={38 * 4}
            height={38 * 4}
            imgUrl={avatarUrl}
            handleDrop={props.handleSelectAvatar}
            stateRerender={props.stateRerender}
            allowChange={!!allowChange}
          />

        </div>
      </div>
    </>
  );
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  return { isLoading };
}

export default withTranslation()(connect(mapStateToProps)(AnhDinhKem));
AnhDinhKem.propTypes = {};
AnhDinhKem.defaultProps = {};
