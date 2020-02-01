import React, {useEffect, useCallback, useState} from 'react'
import { Form, Icon, Input, Button, Checkbox, Row, Col } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { LOGIN_REQUESTED } from '../constants';

function NormalLoginForm(props){
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const history = useHistory()


  useEffect(() => {
    if(user.token) history.push("/")
  }, [user])

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
      dispatch({type: LOGIN_REQUESTED, payload: values })

    });
  };

    const { getFieldDecorator } = props.form;
    return (
        <div style={{padding: 50}}>

        
      <Form onSubmit={handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
        </Form.Item>
      </Form>
      </div>
    );
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);

export default WrappedNormalLoginForm