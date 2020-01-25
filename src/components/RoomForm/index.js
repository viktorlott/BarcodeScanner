import React from 'react'

import { Button, Modal, Form, Input, Radio, Icon } from 'antd';


const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
	// eslint-disable-next-line
	class extends React.Component {
	  render() {
		const { visible, onCancel, onCreate, form } = this.props;
		const { getFieldDecorator } = form;
		return (
		  <Modal
			visible={visible}
			title="Configure Room"
			okText="Create"
			onCancel={onCancel}
			onOk={onCreate}
		  >
			<Form layout="vertical">
			  <Form.Item label="Room name">
				{getFieldDecorator('room_name', {
				  rules: [{ required: true, message: 'Please input a room name!' }],
				})(<Input />)}
			  </Form.Item>
			  <Form.Item label="Passphrase">
				{getFieldDecorator('passphrase')(<Input type="textarea" />)}
			  </Form.Item>
			  <Form.Item className="collection-create-form_last-form-item">
				{getFieldDecorator('modifier', {
				  initialValue: 'public',
				})(
				  <Radio.Group>
					<Radio value="public">Public</Radio>
					<Radio value="private">Private</Radio>
				  </Radio.Group>,
				)}
			  </Form.Item>
			</Form>
		  </Modal>
		);
	  }
	},
  );
  
  class CollectionsPage extends React.Component {
	state = {
	  visible: false,
	};
  
	showModal = () => {
	  this.setState({ visible: true });
	};
  
	handleCancel = () => {
	  this.setState({ visible: false });
	};
  
	handleCreate = () => {
	  const { form } = this.formRef.props;
	  form.validateFields((err, values) => {
		if (err) {
		  return;
		}
  
		console.log('Received values of form: ', values);
		form.resetFields();
		this.setState({ visible: false });

		this.props.onCreate(values.room_name)
	  });
	};
  
	saveFormRef = formRef => {
	  this.formRef = formRef;
	};
  
	render() {
	  return (
		<>
		  <Button type="success" onClick={this.showModal}>
		  	<Icon type="api" /> Create room
		  </Button>
		  <CollectionCreateForm
			wrappedComponentRef={this.saveFormRef}
			visible={this.state.visible}
			onCancel={this.handleCancel}
			onCreate={this.handleCreate}
		  />
		</>
	  );
	}
  }


  export default CollectionsPage