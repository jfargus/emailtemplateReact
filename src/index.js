import React, { useRef } from 'react';
import { render } from 'react-dom';
import EmailEditor from 'react-email-editor';
import sample from './sample.json';
import styled from 'styled-components';
import './index.css';
import * as msg from './msg.js';
import { Button, Input, PageHeader } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
`;

const App = (props) => {

  function importData() {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = _ => {
      // you can use this method to get file and perform respective operations
              let files =   Array.from(input.files);
              fileReader = new FileReader();
              fileReader.onloadend = handleFileRead;
              fileReader.readAsText(files[0]);
          };
    input.click();    
  }
  
  let fileReader;

  const handleFileRead = (e) => {
    const content = fileReader.result;
    emailEditorRef.current.editor.loadDesign(JSON.parse(content));
    
  };
  
  const handleFileChosen = (file) => {
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);
  };

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
      const designFile = new Blob([JSON.stringify(design)],    
      {type: 'application/json;charset=utf-8'});
      element2.href = URL.createObjectURL(designFile);
      element2.download = "myDesign";
      document.body.appendChild(element2);
      element2.click();
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

  const loadNew = (file) => {
    console.log('onLoad');

    emailEditorRef.current.editor.addEventListener(
      'design:loaded',
      onDesignLoad
    );

    emailEditorRef.current.editor.loadDesign(file);
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
        <Button type="secondary" onClick={saveDesign}>Save Current Design</Button>,
        <Button icon={<UploadOutlined />} onClick = {importData}  >Upload an Existing Template</Button>,
        <Button type="dashed" onClick={loadDefault}>Load Sample Template</Button>]}>
      </PageHeader>
      <React.StrictMode>
        <EmailEditor ref={emailEditorRef} onLoad={onLoad} onReady={onReady} />
      </React.StrictMode>
    </Container>
  );
};

render(<App />, document.getElementById('app'));