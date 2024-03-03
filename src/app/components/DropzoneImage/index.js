import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { CloudUploadOutlined } from "@ant-design/icons";
import Dropzone from "react-dropzone";

import { API } from "@api";

import "./DropzoneImage.scss";
import { t } from "i18next";

function DropzoneImage({ allowChange, stateRerender, multiple, imgUrl, width, height, warningImage, api, ...props }) {
  const [imagePreview, setPreview] = useState(null);

  useEffect(() => {
    setPreview(null);
  }, [stateRerender]);

  function handleSelectImages(files) {
    if (!Array.isArray(files) || !files.length) return;
    if (multiple) {
      props.handleDropMulti(files);
    } else {
      setPreview(files[0]);
      props.handleDrop(files[0]);
    }
  }

  const existImg = imagePreview || imgUrl;
  return (
    <>
      <Dropzone
        multiple={multiple}
        accept={"image/*"}
        disabled={!allowChange}
        onDrop={(acceptedFiles) => handleSelectImages(acceptedFiles)}
      >
        {({ getRootProps, getInputProps }) => (
          <div className={`custom-dropzone ${allowChange ? "" : "disabled"}`} style={{ width, height }}>
            <div {...getRootProps()} className="bg-upload">
              <input {...getInputProps()} />

              {existImg && (
                <>
                  {imagePreview ? (
                    <img src={URL.createObjectURL(imagePreview)} alt="" />
                  ) : (
                    <img
                      src={
                        // warningImage === true ? API.PREVIEW_WARNING_ID.format(imgUrl) : API.PREVIEW_ID.format(imgUrl)
                        api.format(imgUrl)
                      }
                      alt=""
                    />
                  )}
                </>
              )}
              {!existImg && allowChange && (
                <div>
                  <CloudUploadOutlined style={{ fontSize: 20 }} />
                  <div style={{ marginTop: 8 }}>{t("TAI_LEN")}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </Dropzone>
    </>
  );
}

DropzoneImage.propTypes = {
  handleDrop: PropTypes.func,
  handleDropMulti: PropTypes.func,
  multiple: PropTypes.bool,
  width: PropTypes.any,
  height: PropTypes.any,
  allowChange: PropTypes.bool,
};

DropzoneImage.defaultProps = {
  handleDrop: () => null,
  handleDropMulti: () => null,
  multiple: false,
  width: 150,
  height: 150,
  allowChange: true,
};

export default DropzoneImage;
