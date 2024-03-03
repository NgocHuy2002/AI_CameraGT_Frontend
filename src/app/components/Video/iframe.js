import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Image } from "antd";

const IframeCustom = ({ width, height, src }) => {
  const iframeRef = useRef(null);

  return (
    <Image
      id="document"
      ref={iframeRef}
      src={src ? src : null}
      preview={false}
      width={width}
      height={height}
      // allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
      // allowFullScreen
    />
  );
};

IframeCustom.propTypes = {
  embedId: PropTypes.string.isRequired,
};

export default IframeCustom;
