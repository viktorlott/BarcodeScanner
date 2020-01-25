import React from 'react'
import { Table, List, Icon } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { Typography } from 'antd';

const { Paragraph } = Typography;

const columns = [
	{
	  title: 'Name',
	  dataIndex: 'name',
	  // render: text => <a>{text}</a>,
	},
	{
	  title: 'Cost',
	  className: 'column-money',
	  dataIndex: 'cost',
	  render: text => <a>{text}kr</a>
	},
	{
	  title: 'Code',
	  dataIndex: 'code',
	},
  ];

export default function Barcodes() {
	const list = useSelector(state => state.products)

	const data = (list || []).map((item, i) => {
		let product = {}
		if(item.product) {
			product.cost = item.product.price
			product.name = item.product.title
		}
		return {
			key: ""+i,
			code: item.code,
			...product
		}
	})

	return (
		<div>

			<List
				size="small"
				bordered
				dataSource={data}
				renderItem={item => (
					<List.Item> 
						<Icon type="barcode" /> 
						<span style={{marginLeft: 15}}>
							<Paragraph style={{display: "inline-block", marginBottom: 0}} copyable>{item.code}</Paragraph>	 
						</span>
					</List.Item>
				)}
			/>


		</div>
	)
}







