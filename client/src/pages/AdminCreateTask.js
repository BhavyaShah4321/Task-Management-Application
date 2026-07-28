import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Layout,
  Typography,
  Card,
  Form,
  Select,
  Input,
  Button,
  Row,
  Col,
  DatePicker,
  message,
  theme,
} from 'antd';
import dayjs from 'dayjs';
import { fetchAdminUsers, assignTask } from '../redux/slices/adminSlice';
import AppHeader from '../components/AppHeader';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const AdminCreateTask = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { token } = theme.useToken();

  const { user } = useSelector((state) => state.auth);
  const { users, usersLoading, actionLoading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  const disabledDate = (current) => {
    const today = dayjs().startOf('day');
    return current && current < today;
  };

  const handleSubmit = async (values) => {
    const result = await dispatch(assignTask(values));
    if (assignTask.fulfilled.match(result)) {
      message.success('Task assigned successfully');
      navigate('/admin');
    } else {
      message.error(result.payload || 'Failed to assign task');
    }
  };

  const handleCancel = () => {
    navigate('/admin');
  };

  return (
    <Layout style={{ minHeight: '100vh', background: token.colorBgLayout }}>
      <AppHeader user={user} />

      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Title level={3} style={{ marginBottom: 8 }}>
            Create Task
          </Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
            Assign a new task to a user.
          </Text>

          <Card>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                priority: 'Medium',
                status: 'Pending',
              }}
            >
              <Form.Item
                name="userId"
                label="Assign To"
                rules={[{ required: true, message: 'Please select a user' }]}
              >
                <Select
                  placeholder="Select a user"
                  showSearch
                  loading={usersLoading}
                  filterOption={(input, option) =>
                    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {users.map((u) => (
                    <Option key={u._id} value={u._id}>
                      {u.name} — {u.email}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="title"
                label="Title"
                rules={[
                  { required: true, message: 'Please enter a title' },
                  { whitespace: true, message: 'Title cannot be empty' },
                ]}
              >
                <Input placeholder="Task title" />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
              >
                <Input.TextArea rows={3} placeholder="Task description" />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="priority"
                    label="Priority"
                  >
                    <Select>
                      <Option value="Low">Low</Option>
                      <Option value="Medium">Medium</Option>
                      <Option value="High">High</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    name="status"
                    label="Status"
                  >
                    <Select>
                      <Option value="Pending">Pending</Option>
                      <Option value="In Progress">In Progress</Option>
                      <Option value="Completed">Completed</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="dueDate"
                label="Due Date"
                rules={[{ required: true, message: 'Please select a due date' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  disabledDate={disabledDate}
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={actionLoading}>
                  Create Task
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={handleCancel}>
                  Cancel
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default AdminCreateTask;
