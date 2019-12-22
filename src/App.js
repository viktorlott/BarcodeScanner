import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components'
import useScanner from './hooks/useScanner'
import JsBarcode from "jsbarcode";
import io from 'socket.io-client'
import Scanner from './components/Scanner'
import { useSelector, useDispatch } from 'react-redux'
import { addProduct, changeProduct } from './actions/products.action';
import { Input, Button } from 'antd';


import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";

import { Layout, Menu, Breadcrumb, Icon } from 'antd';

import Barcodes from './views/Barcodes'
import fetchBarcode from './components/Scanner/Utils/maxiproductfetcher';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const socket = io("https://develottment.com", { path: "/stream"})


class SiderDemo extends React.Component {
  state = {
    collapsed: true,
    room: "scanner"
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  render() {
    return (

      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1">
              <Link to="/">
                <Icon type="api" />
                <span>Rooms</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/barcodes">
                <Icon type="barcode" />
                <span>Barcodes</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="3">
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
                <h4>Room: {this.state.room}</h4>
                  <Input value={this.state.room} onChange={(e) => this.setState({room: e.target.value})}/>
                  <Button onClick={() => socket.emit("/join", this.state.room)}>Join</Button>  
                </div>}/>


              </Switch>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}></Footer>
        </Layout>
      </Layout>


    );
  }
}


function App() {
	const dispatch = useDispatch()

  useEffect(() => {
    socket.on("connect", msg => console.log("Connected -> " , socket.id))

		socket.on("/recieve/barcode", barcode => {
			dispatch(addProduct({code: barcode}))
			fetchBarcode(barcode)
				.then(product => product.json())
				.then(product => void product && dispatch(changeProduct(product)))
		})
  },[])
  
  return (
    <div>
      <Route path="/scanner" render={() => <Scanner socket={socket}/>}/>
      <Route path="/" render={() => <SiderDemo />}/>
    </div>
  );
}

export default App;
