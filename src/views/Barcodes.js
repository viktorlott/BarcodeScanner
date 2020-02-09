import React from 'react'
import { Table, List, Icon, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { Typography } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import { SwipeableList, SwipeableListItem } from '@sandstreamdev/react-swipeable-list';
import '@sandstreamdev/react-swipeable-list/dist/styles.css';
import { PRODUCT_DELETE } from '../constants';

const { Paragraph } = Typography;


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
					<List
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
					/>
				</InfiniteScroll>

			</SwipeableList>
		</div>
	)
}







