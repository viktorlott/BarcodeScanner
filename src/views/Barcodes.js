import React from 'react'
import { Table, Icon, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { Typography } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import { SwipeableList, SwipeableListItem } from '@sandstreamdev/react-swipeable-list';
import '@sandstreamdev/react-swipeable-list/dist/styles.css';
import { PRODUCT_DELETE, PRODUCT_ADD, PRODUCT_EMIT } from '../constants';
import { NavBar, TabBar, ListView, Row, SwipeAction, List } from 'antd-mobile';
const { Paragraph } = Typography;



function Items(props) {
	const { dispatch } = props

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
                            onPress: () => dispatch({type: PRODUCT_DELETE, payload: { code: item.code }}),
                            style: { backgroundColor: '#F4333C', color: 'white' },
                            },
                            {
                            text: 'Add',
                            onPress: () => dispatch({type: PRODUCT_EMIT, payload:  { code: item.code } }),
                            style: { backgroundColor: '#108ee9', color: 'white' },
                            }
                        ]}
                        onOpen={() => console.log('global open')}
                        onClose={() => console.log('global close')}>

						<List.Item
							extra={"x" + item.amount || "1"}
							arrow="horizontal"
							onClick={e => console.log(e)}>
								<Icon type="barcode" />
								<span style={{ marginLeft: 15 }}>
									<Paragraph style={{ display: "inline-block", marginBottom: 0 }} copyable>{item.code}</Paragraph>
									{/* <div style={{ display: "inline-block", position: "absolute", right: 0, paddingRight: 10 }}>x{item.amount || "1"}</div> */}
								</span>
						</List.Item>
					</SwipeAction>
                )
            })}
        </List>
    )
}

export default function Barcodes() {
	const list = useSelector(state => state.products)
	const dispatch = useDispatch()

	const data = (list || []).map((item, i) => {
		let product = {}
		if (item.product) {
			product.cost = item.product.price
			product.name = item.product.title
		}

		return {
			key: "" + i,
			code: item.code,
			...item,
			...product
		}
	})

	return (
		<div style={{height: "calc(100vh - 300px)", overflow: "auto"}}>
			<SwipeableList>
				<InfiniteScroll
					loadMore={() => {}}
					initialLoad={false}
					pageStart={0}
					useWindow={true}>
					<Items
						data={data}
						dispatch={dispatch}
					/>

					{/* <List
						size="default"
						dataSource={data}
						renderItem={item => (
							<SwipeableListItem
								swipeLeft={{
									content: <div style={{width: "100%", backgroundColor: "red", color: "white"}}><div style={{float: "right", height: "100%", paddingRight: 10, textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", verticalAlign: "middle"}}>Remove</div></div>,
									action: () => dispatch({type: PRODUCT_DELETE, payload: { code: item.code }})
								}}
								swipeRight={{
									content: <div>Revealed content during swipe</div>,
									action: () => console.info('swipe action triggered')
								}}>
									<List.Item>
										<Icon type="barcode" />
										<span style={{ marginLeft: 15 }}>
											<Paragraph style={{ display: "inline-block", marginBottom: 0 }} copyable>{item.code}</Paragraph>
											<div style={{ display: "inline-block", position: "absolute", right: 0, paddingRight: 10 }}>x{item.amount || "1"}</div>
										</span>
									</List.Item>
							</SwipeableListItem>
						)}
					/> */}
				</InfiniteScroll>

			</SwipeableList>
		</div>
	)
}







