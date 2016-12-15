/**
 * Created by dz on 16/10/10.
 */
/* eslint react/no-danger:off */
import React, { PropTypes } from 'react';

function getYYPlayer(topSid, subSid = topSid) {
  const str = `sceneType=1&amp;danmu=false&amp;volume=0.5&amp;
  source=http%3A%2F%2Fwww.yy.com%2F54880976%2F54880976%3FtempId%3D16777217%26f%3Dqqzone%26cpuid%3D0
  &amp;anchorId=0&amp;livedelay=1&amp;coop=0&amp;topSid=${topSid}&amp;subSid=${subSid}`;

  return `
    <object 
        id="player" name="player" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
        codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10.0.32"
        data="http://weblbs.yystatic.com/s/${topSid}/${subSid}/yycomscene.swf" 
        height="100%" width="100%">
    <param name="movie" value="http://weblbs.yystatic.com/s/54880976/54880976/yycomscene.swf">
    <param name="flashvars" value="${str}">
    <param name="quality" value="high">
    <param name="allowScriptAccess" value="always">
    <param name="wmode" value="opaque">
    <param name="bgcolor" value="#000000">
    <param name="allowFullScreen" value="true">
    <param name="allowFullScreenInteractive" value="true">
    <embed id="embed_player" src="http://weblbs.yystatic.com/s/${topSid}/${subSid}/yycomscene.swf" 
           allowfullscreen="true"
           allowfullscreeninteractive="true" allowscriptaccess="always" quality="high"
           pluginspage="http://www.macromedia.com/go/getflashplayer"
           flashvars="${str}"
           type="application/x-shockwave-flash" wmode="opaque" 
           bgcolor="#000000" height="100%" width="100%">
    </object> `;
}

const YYPlayer = props => (<div
  style={{ width: '100%', height: '100%' }}
  dangerouslySetInnerHTML={{ __html: getYYPlayer(props.topSid, props.subSid) }}
/>);

YYPlayer.propTypes = {
  topSid: PropTypes.string,
  subSid: PropTypes.string,
};

export default YYPlayer;
