import React from 'react'
import { Table, List, Icon } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { Typography } from 'antd';

const { Paragraph } = Typography;

import InfiniteScroll from 'react-infinite-scroller';

export default function Barcodes() {
	const list = useSelector(state => state.products)

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
			<InfiniteScroll
				loadMore={() => {}}
				initialLoad={false}
				pageStart={0}
				useWindow={true}
			>
				<List
					size="default"
					dataSource={data}
					renderItem={item => (
						<List.Item>
							<Icon type="barcode" />
							<span style={{ marginLeft: 15 }}>
								<Paragraph style={{ display: "inline-block", marginBottom: 0 }} copyable>{item.code}</Paragraph>
								<div style={{ display: "inline-block", position: "absolute", right: 0, paddingRight: 10 }}>x{item.amount || "1"}</div>
							</span>
						</List.Item>
					)}
				/>


			</InfiniteScroll>


		</div>
	)
}







