import React from 'react'
import { NavBar, Icon, TabBar, ListView, Row, SwipeAction, List } from 'antd-mobile';
import { WingBlank, WhiteSpace } from 'antd-mobile';

import styled from 'styled-components'

const Container = styled.div`
    height: 100%;
    width: 100%;
    position: fixed;
    top: 0;
`

const data = [
    {
      img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
      title: 'Meet hotel',
      des: '不是所有的兼职汪都需要风吹日晒',
    },
    {
      img: 'https://zos.alipayobjects.com/rmsportal/XmwCzSeJiqpkuMB.png',
      title: 'McDonald\'s invites you',
      des: '不是所有的兼职汪都需要风吹日晒',
    },
    {
      img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
      title: 'Eat the week',
      des: '不是所有的兼职汪都需要风吹日晒',
    },
  ];


function Items(props) {


    return (

        <List>
            {props.data.map(item => {
                return (
                    <SwipeAction
                        style={{ backgroundColor: 'gray' }}
                        autoClose
                        right={[
                            {
                            text: 'Remove',
                            onPress: () => console.log('remove'),
                            style: { backgroundColor: '#F4333C', color: 'white' },
                            },
                            {
                            text: 'Add',
                            onPress: () => console.log('add'),
                            style: { backgroundColor: '#108ee9', color: 'white' },
                            }
                        ]}
                        onOpen={() => console.log('global open')}
                        onClose={() => console.log('global close')}>
                            <List.Item
                                extra="More"
                                arrow="horizontal"
                                onClick={e => console.log(e)}>
                                    hello
                            </List.Item>
                        </SwipeAction>
                )
            })}
        </List>
    )
}

function Layout(props) {
    return (
        <Container>
            {/* <NavBar
                mode="light"
                icon={<Icon type="left" />}
                onLeftClick={() => console.log('onLeftClick')}
                rightContent={[
                    <Icon key="0" type="search" style={{ marginRight: '16px' }} />,
                    <Icon key="1" type="ellipsis" />,
                ]}>NavBar</NavBar> */}
                {/* <div style={{height: "90vh"}}>{props.children}</div> */}
        <TabBar
            unselectedTintColor="#949494"
            tintColor="#33A3F4"
            barTintColor="white"
            tabBarPosition="bottom"
            hidden={false}
            prerenderingSiblingsNumber={0}>
          <TabBar.Item
            title="Home"
            key="Home"
            selected={true}
            icon={<div style={{
              width: '22px',
              height: '22px',
              background: 'url(https://zos.alipayobjects.com/rmsportal/sifuoDUQdAFKAVcFGROC.svg) center center /  21px 21px no-repeat' }}
            />}
            selectedIcon={<div style={{
              width: '22px',
              height: '22px',
              background: 'url(https://zos.alipayobjects.com/rmsportal/iSrlOTqrKddqbOmlvUfq.svg) center center /  21px 21px no-repeat' }}
            />}
            // selected={this.state.selectedTab === 'blueTab'}
            // badge={1}
            onPress={() => {
              this.setState({
                selectedTab: 'blueTab',
              });
            }}
            data-seed="logId">

            <Items data={[1,2,3,4]} />
          </TabBar.Item>
          <TabBar.Item
            icon={
              <div style={{
                width: '22px',
                height: '22px',
                background: 'url(https://gw.alipayobjects.com/zos/rmsportal/BTSsmHkPsQSPTktcXyTV.svg) center center /  21px 21px no-repeat' }}
              />
            }
            selectedIcon={
              <div style={{
                width: '22px',
                height: '22px',
                background: 'url(https://gw.alipayobjects.com/zos/rmsportal/ekLecvKBnRazVLXbWOnE.svg) center center /  21px 21px no-repeat' }}
              />
            }
            title="Koubei"
            key="Koubei"
            badge={'new'}
            // selected={this.state.selectedTab === 'redTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'redTab',
              });
            }}
            data-seed="logId1"
          >

          </TabBar.Item>
          <TabBar.Item
            icon={
              <div style={{
                width: '22px',
                height: '22px',
                background: 'url(https://zos.alipayobjects.com/rmsportal/psUFoAMjkCcjqtUCNPxB.svg) center center /  21px 21px no-repeat' }}
              />
            }
            selectedIcon={
              <div style={{
                width: '22px',
                height: '22px',
                background: 'url(https://zos.alipayobjects.com/rmsportal/IIRLrXXrFAhXVdhMWgUI.svg) center center /  21px 21px no-repeat' }}
              />
            }
            title="Friend"
            key="Friend"
            dot
            // selected={this.state.selectedTab === 'greenTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'greenTab',
              });
            }}
          >

          </TabBar.Item>
        </TabBar>
        </Container>
    )
}

export default Layout