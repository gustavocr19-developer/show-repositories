import React, { useState } from 'react'
import { Table, Row, Col, Input, Button, Avatar, notification } from 'antd'
import { UserOutlined, SearchOutlined } from '@ant-design/icons';
import "antd/dist/antd.css";
const axios = require('axios')

const Form = () => {

  //Variables
  const [list, setList] = useState([])
  const [avatarImage, setAvatarImage] = useState('')
  const [userName, setUserName] = useState('')
  const [inputValue, setInputValue] = useState('')

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Project ID',
      dataIndex: 'projectId',
      key: 'projectId',
    },
    {
      title: 'Private',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Html_url',
      dataIndex: 'html_url',
      render: text => <a href={text} target='blank'>Project Link</a>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Language',
      dataIndex: 'language',
      key: 'language',
    },
  ];

  const openNotification = (mtype, title, message) => {
    notification.open({
      type: mtype,
      message: title,
      description: message,
    })
  }

  const handleSetUserName = async (e) => {
    e.preventDefault();

    if (inputValue === '') {
      openNotification('error', 'Error', 'Empty values are not allowed')
    } else {

      //Request
      const res = await axios.get(`https://api.github.com/users/${inputValue}/repos`)
        .then(response => response.data)
        .catch(error => {
          console.log(error)
          return error
        })
      console.log(res)
      //Request

      //Request data to states
      let arr = []
      try {
        res.map((item, index) => {
          const { id, name, html_url, description, language } = item
          const status = (item.private === false ? 'No' : 'Yes')
          const avatar = item.owner.avatar_url
          const login = item.owner.login
          arr.push({
            id: index + 1,
            projectId: id,
            avatar_url: avatar,
            login: login,
            status,
            name,
            html_url,
            description,
            language
          })

        })

        setList(arr)
        setAvatarImage(arr[0].avatar_url)
        setUserName(arr[0].login)

        openNotification('success', 'Success', 'Now you can see all repositories')
      }
      catch (error) {
        openNotification('error', 'Error to fin user', 'Please, try another one')
      }
    }

    //Request data to states
  }

  return (
    <div className='form'>
      <Row>
        <Col span={24}>
          <div className='avatar'>

            <Avatar size={150}
              icon={<UserOutlined />}
              src={avatarImage}
            />
            <p>User: {userName} </p>
            <p>{list.length} repositories</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={6} offset={8}>
          <Input placeholder="Type a GitHub username"
            size="large"
            onChange={e => setInputValue(e.target.value)}
            prefix={<UserOutlined />} />
        </Col>
        <Col span={2}>
          <Button type="primary"
            icon={<SearchOutlined />}
            size="large"
            onClick={handleSetUserName}
          />
        </Col>
      </Row>

      <Row>
        <Col span={24} >
          {(list.length === 0 ?
            <p className='no-data'>
              Fill out input field above, to find user repositories 👋.
            </p>
            :
            <Table
              className='table-control'
              dataSource={list}
              columns={columns}
              style={{ marginTop: 20, marginBottom: 20 }} />)
          }
        </Col>
      </Row>
    </div>
  )
}


export default Form
