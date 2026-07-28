import React, { useEffect } from 'react';
import { Form, Input, Select, DatePicker, Button, Space } from 'antd';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

// Disable dates before today in the DatePicker
const disablePastDates = (current) => {
  return current && current < dayjs().startOf('day');
};

// Used for both Create and Edit.
// When `task` prop is provided the form pre-fills with that task's values.
const TaskForm = ({ task, onSubmit, onCancel, loading }) => {
  const [form] = Form.useForm();

  // Pre-fill form when editing an existing task
  useEffect(() => {
    if (task) {
      form.setFieldsValue({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate ? dayjs(task.dueDate) : null,
      });
    } else {
      form.resetFields();
    }
  }, [task, form]);

  const handleFinish = (values) => {
    const data = {
      title: values.title,
      description: values.description,
      priority: values.priority,
      status: values.status,
      dueDate: values.dueDate.toISOString(),
    };
    onSubmit(data);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      requiredMark={false}
      initialValues={{ priority: 'Medium', status: 'Pending' }}
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: 'Title is required' }]}
      >
        <Input placeholder="Task title" maxLength={150} />
      </Form.Item>

      <Form.Item label="Description" name="description">
        <TextArea
          placeholder="Optional description"
          rows={3}
          maxLength={1000}
          showCount
        />
      </Form.Item>

      <Form.Item
        label="Priority"
        name="priority"
        rules={[{ required: true, message: 'Please select a priority' }]}
      >
        <Select placeholder="Select priority">
          <Option value="Low">Low</Option>
          <Option value="Medium">Medium</Option>
          <Option value="High">High</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Status"
        name="status"
        rules={[{ required: true, message: 'Please select a status' }]}
      >
        <Select placeholder="Select status">
          <Option value="Pending">Pending</Option>
          <Option value="In Progress">In Progress</Option>
          <Option value="Completed">Completed</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Due Date"
        name="dueDate"
        rules={[{ required: true, message: 'Due date is required' }]}
      >
        <DatePicker
          style={{ width: '100%' }}
          disabledDate={disablePastDates}
          format="YYYY-MM-DD"
        />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default TaskForm;
