import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components'
import useScanner from './hooks/useScanner'
import JsBarcode from "jsbarcode";
import Scanner from './components/Scanner'
import { useSelector, useDispatch } from 'react-redux'
import { addProduct, populateProductWithData } from './actions/products.action';

import { Input, Button } from 'antd';


import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation
} from "react-router-dom";

import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import Barcodes from './views/Barcodes'
import { fetchMaxiProduct } from './utils/fetchApi';
import { PRODUCT_REQUESTED, SOCKET_ROOM_CREATE_REQUESTED, SOCKET_ROOM_JOIN_REQUESTED } from './constants';



const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;





const SiderDemo = () => {
  const [state, setState] = useState({
    collapsed: true,
    room: "scanner",
    selectedKey: "/"
  })
  const rooms = useSelector(state => state.rooms)

	const dispatch = useDispatch()

  const location = useLocation()

  useEffect(() => {
    console.log(location)
    setState(prev => ({...prev, selectedKey: location.pathname}))
  }, [location.pathname])

  const onCollapse = collapsed => {
    setState(prev => ({ ...prev, collapsed }));
  };
  
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsed={state.collapsed} onCollapse={onCollapse}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={[state.selectedKey]} selectedKeys={[state.selectedKey]} mode="inline">
            <Menu.Item key="/">
              <Link to="/">
                <Icon type="api" />
                <span>Rooms</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/barcodes">
              <Link to="/barcodes">
                <Icon type="barcode" />
                <span>Barcodes</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/scanner">
              <Link to="/scanner">
                <Icon type="scan" />
                <span>Scanner</span>
              </Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }} />
          <Content style={{ margin: '0' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              <Switch>
                <Route path="/barcodes" render={() => <Barcodes/>}/>
                <Route path="/" render={() => <div>
                <h4>You're in room: {rooms.roomname}</h4>

                <div style={{margin: "10px 0"}}>
                  <ul>
                    {Object.entries(rooms.members).map(([member, status]) => {
                      return <li>{member} -> active: {status ? "YES" : "NO"}</li>
                    })}
                  </ul>
                </div>
                  <Input value={state.room} onChange={(e) => setState(prev => ({ ...prev, room: e.target.value}))}/>
                  <Button 
                    onClick={() => dispatch({type: SOCKET_ROOM_CREATE_REQUESTED, payload: {roomname: state.room}})}>Create</Button>  
                  <Button 
                    onClick={() => dispatch({type: SOCKET_ROOM_JOIN_REQUESTED, payload: {roomname: state.room}})}>Join</Button>  
                  {rooms.error && <div>{rooms.error.message}</div>}
                </div>
              }/>
              </Switch>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}></Footer>
        </Layout>
      </Layout>
    );
}


function App() {

  useEffect(() => {

  },[])
  
  return (
    <div>
      <Route path="/scanner" render={() => <Scanner />}/>
      <Route path="/" render={() => <SiderDemo />}/>
    </div>
  );
}

export default App;
