import React, { useRef } from 'react';
import { render } from 'react-dom';
import EmailEditor from 'react-email-editor';
import sample from './sample.json';
import styled from 'styled-components';
import './index.css';
import * as msg from './msg.js';
import { Button, DatePicker, PageHeader } from 'antd';
import './index.css'


const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
`;

const App = (props) => {
  const emailEditorRef = useRef(null);
  function createMSGFile(html) {
    const htmlBody = html
    const htmlBodyWithRtf = "{\\rtf1\\ansi\\ansicpg1252\\fromhtml1 \\htmlrtf0 " + htmlBody + "}"
    const rtfBody = new TextEncoder().encode(htmlBodyWithRtf)
    const message = new msg.Message();
    message.bodyTtmlText = htmlBody
    message.bodyRtf = rtfBody
    message.messageFlags.push(msg.MessageFlag.UNSENT);
    message.storeSupportMasks.push(msg.StoreSupportMask.CREATE);
    return message
  };
  const exportHtml = () => {
    emailEditorRef.current.editor.exportHtml((data) => {
      const element = document.createElement("a");
      const { design, html } = data;
      console.log('exportHtml', html);
      const msgFile = createMSGFile(html);
      const file = new Blob([msgFile.toBytes()],    
               {type: 'text/plain;charset=utf-8'});
      element.href = URL.createObjectURL(file);
      element.download = "template.msg";
      document.body.appendChild(element);
      element.click();
    });
  };
  const saveDesign = () => {
    emailEditorRef.current.editor.saveDesign((design) => {
      const element2 = document.createElement("a");
      console.log('saveDesign', design);
      const designFile = new Blob([design],    
      {type: 'application/json;charset=utf-8'});
      element2.href = URL.createObjectURL(designFile);
      element2.download = "template.json";
      document.body.appendChild(element2);
      element2.click();
      alert('Design JSON has been logged in your developer console.');
    });
  };

  const onDesignLoad = (data) => {
    console.log('onDesignLoad', data);
  };

  const onLoad = () => {
    console.log('onLoad');

    emailEditorRef.current.editor.addEventListener(
      'design:loaded',
      onDesignLoad
    );

    //emailEditorRef.current.editor.loadDesign(sample);
  }

  const loadDefault = () => {
    console.log('onLoad');

    emailEditorRef.current.editor.addEventListener(
      'design:loaded',
      onDesignLoad
    );

    emailEditorRef.current.editor.loadDesign(sample);
  }

  const onReady = () => {
    console.log('onReady');
  };

  return (
    <Container>
      <PageHeader
        title = "RMHC Philly Email Template Designer"
        extra={[
        <Button type="primary" onClick={exportHtml}>Export Your Template</Button>,
        <Button type="secondary" onClick={loadDefault}>Load Sample Template</Button>,
        <Button type="secondary" onClick={saveDesign}>Save Current Design</Button>,]}>
      </PageHeader>
      <React.StrictMode>
        <EmailEditor ref={emailEditorRef} onLoad={onLoad} onReady={onReady} />
      </React.StrictMode>
    </Container>
  );
};

render(<App />, document.getElementById('app'));