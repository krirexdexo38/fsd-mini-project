import React from 'react';
import Loader from '../kokonutui/loader';

const LoadingSpinner = ({ size = 'md', text = 'Loading...', subtitle }) => {
  return (
    <Loader
      size={size}
      title={text}
      subtitle={subtitle || "Please wait a moment while we load your content"}
    />
  );
};

export default LoadingSpinner;
