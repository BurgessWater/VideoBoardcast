/**
 * Created by dz on 16/10/11.
 */
/* eslint react/no-danger:off */
import React, { PropTypes } from 'react';

function getYKPlayer(id) {
  const url = `http://player.youku.com/player.php/Type/Folder/Fid//Ob//sid/${id}/v.swf`;
  return `
    <object 
        id="player" name="player" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
        codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10.0.32"
        data="${url}" 
        height="100%" width="100%">
    <param name="movie" value="${url}">
    <param name="quality" value="high">
    <param name="allowScriptAccess" value="always">
    <param name="wmode" value="opaque">
    <param name="bgcolor" value="#000000">
    <param name="allowFullScreen" value="true">
    <param name="allowFullScreenInteractive" value="true">
    <embed src="${url}" quality='high' width='100%' height='100%' align='middle'
     allowScriptAccess='always' 
     allowFullScreen='true' mode='transparent' type='application/x-shockwave-flash'></embed>
    </object> `;
}

const YoukuPlayer = props => (<div
  style={{ width: '100%', height: '100%' }}
  dangerouslySetInnerHTML={{ __html: getYKPlayer(props.yid) }}
/>);

YoukuPlayer.propTypes = {
  yid: PropTypes.string,
};

export default YoukuPlayer;
