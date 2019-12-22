import React from 'react'
import { Table } from 'antd';
import { useSelector, useDispatch } from 'react-redux'


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
			<Table
				columns={columns}
				dataSource={data}
				bordered
				title={() => 'List of scanned barcodes'}
			/>
		</div>
	)
}







