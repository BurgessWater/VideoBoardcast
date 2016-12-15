/**
 * Created by dz on 16/10/10.
 */
/* eslint react/no-danger:off */
import React from 'react';

function getGenseePlayerHtml() {
  return `
        <gs:video-live 
        id="videoComponent" ctx="webcast" site="yining.gensee.com"  
        ownerid="502f17039ff44f97bbbf50919c94ecc5" uname="111111" authcode="222222"/>
    `;
}

export default class GenseePlayer extends React.Component {
  componentDidMount() {
    const script = document.createElement('script');
    script.id = 'gssdk';
    script.src = 'http://static.gensee.com/webcast/static/sdk/js/gssdk.js';
    script.async = true;
    document.body.appendChild(script);
    // TODO: 播放器无法二次加载
    // setTimeout(() => {
    //   console.log('gggg',GS);
    //   let GS = GS || null;
    //   if (GS) GS._open_.loadSDKTags();
    // }, 6000);
  }

  componentWillUnmount() {
    const s = document.getElementById('gssdk');
    s.parentNode.removeChild(s);
  }

  render() {
    return (
      <div
        style={{ width: '100%', height: '100%' }}
        dangerouslySetInnerHTML={{ __html: getGenseePlayerHtml() }}
      />
    );
  }
}
