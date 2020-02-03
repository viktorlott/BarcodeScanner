import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components'
import useScanner from './hooks/useScanner'
import JsBarcode from "jsbarcode";
import Scanner from './components/Scanner'
import Login from './views/Login'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { addProduct, populateProductWithData } from './actions/products.action';

import { Input, Button } from 'antd';


import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
  useLocation
} from "react-router-dom";

import { Layout, Menu, Breadcrumb, Icon, Badge, PageHeader, Tag, Statistic, Descriptions, Row, Col, Typography, Divider, message } from 'antd';
import Barcodes from './views/Barcodes'
import { fetchMaxiProduct } from './utils/fetchApi';
import { PRODUCT_REQUESTED, SOCKET_ROOM_CREATE_REQUESTED, SOCKET_ROOM_JOIN_REQUESTED, EXTENSION_SEND_MESSAGE } from './constants';
import CollectionsPage from './components/RoomForm/index';

const { Paragraph } = Typography;

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;



const error = msg => {
  message.error(msg);
};


const AppManager = () => {
  const [state, setState] = useState({
    collapsed: true,
    room: "scanner",
    selectedKey: "/"
  })
  const rooms = useSelector(state => state.rooms)
  const products = useSelector(state => state.products)

	const dispatch = useDispatch()

  const location = useLocation()

  useEffect(() => {
    console.log(location)
    setState(prev => ({...prev, selectedKey: location.pathname}))
  }, [location.pathname])

  const onCollapse = collapsed => {
    setState(prev => ({ ...prev, collapsed }));
  };

  useEffect(() => {
    dispatch({type: SOCKET_ROOM_JOIN_REQUESTED, payload: {roomname: state.room}})
  },[state.room])



  const err = rooms && rooms.error && rooms.error.message || false


  useEffect(() => {
    if(err) {
      error(rooms.error.message, 1)
      console.log("-->", rooms.roomname)
      setState(prev => ({...prev, room: rooms.roomname}))
    }
  },[err])
  

  const onChange = (str) => setState(prev => ({ ...prev, room: str}))
    return (
      <Layout style={{  }}>

        <Layout>

          <Header style={{ background: '#fff', padding: 0 }} >
          <PageHeader
            style={{
              border: '1px solid rgb(235, 237, 240)',
            }}

            title="Room:"
            subTitle={<Paragraph level="h4" ellipsis={true} editable={{ onChange }}>{state.room}</Paragraph>}
            extra={[
              <CollectionsPage  key="collectionsPage" onCreate={room_name => {
                dispatch({type: SOCKET_ROOM_CREATE_REQUESTED, payload: {roomname: room_name}})
                setState(prev => ({...prev, room: room_name}))
              }}/>, 
              <Link key="scanner" to="/scanner">
                <Button type="danger">
                    <Icon type="scan" />
                    <span>Scanner</span>
                </Button>
              </Link>,
            ]}
            footer={
              <Content style={{ margin: '0', height: "calc(100% - 300px)", overflowY: "scroll" }}>
              <div style={{ background: '#fff', minHeight: 360 }}>
                <Switch>
                  <Route path="/" render={() => (
                    <Row>
                        <Barcodes/>
                    </Row>
                  )}/>
                </Switch>

              </div>
            </Content>
            }>
            <Descriptions size="large" column={2}>
              <Descriptions.Item label="Active">
                <Badge status="success" style={{marginRight: "-5px"}} /> <span>{Object.keys(rooms.members).length}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Amount">
                <a>{products.length}</a>
              </Descriptions.Item>

          
              <Descriptions.Item label="Creation Time">2017-01-10</Descriptions.Item>
              <Descriptions.Item label="Created">Viktor Lott</Descriptions.Item>
            </Descriptions>
            <Divider>Barcodes</Divider>

            <Row gutter={[10]}>
              {/* <Col span="6">
                <Input value={state.room} onChange={(e) => setState(prev => ({ ...prev, room: e.target.value}))}/>
                {rooms.error && <div>{rooms.error.message}</div>}
                </Col> */}
                {/* <Col span="3">
                  <Button onClick={() => dispatch({type: SOCKET_ROOM_CREATE_REQUESTED, payload: {roomname: state.room}})}>Create</Button>  
                </Col> */}
                {/* <Col span="3">
                <Button onClick={() => dispatch({type: SOCKET_ROOM_JOIN_REQUESTED, payload: {roomname: state.room}})}>Join</Button>  
                          
                </Col> */}
            </Row>
          </PageHeader>
   

          </Header>
          
        </Layout>
      </Layout>
    );
}





function App() {
  const user = useSelector(state => state.user)
  const history = useHistory()


  useEffect(() => {
    if(!user.token) history.replace("/login")
  },[user])
  
  return (
    <div>
      <Switch>
        <Route path="/login" render={() => {
          
          return (
            <Layout>
                <Login /> 
            </Layout>    
          )
        }}/>
        <Route path="/scanner" render={() => <Scanner />}/>
        <Route path="/" render={() => <AppManager />}/>
      </Switch>
    </div>
  );
}

export default App;
