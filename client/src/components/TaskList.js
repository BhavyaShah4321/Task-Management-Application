import React from 'react';
import { Table, Tag, Button, Popconfirm, Space, Typography, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;

const priorityColors = { Low: 'green', Medium: 'orange', High: 'red' };
const statusColors = { Pending: 'default', 'In Progress': 'blue', Completed: 'success' };

const TaskList = ({ tasks, actionLoading, onEdit, onDelete, onMarkCompleted }) => {
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Text delete={record.status === 'Completed'}>{text}</Text>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      render: (text) => {
        if (!text) {
          return <Text type="secondary">—</Text>;
        }

        return (
          <Tooltip
            placement="topLeft"
            title={
              <div
                style={{
                  maxWidth: 400,
                  maxHeight: 180,
                  overflowY: 'auto',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  paddingRight: 4,
                }}
              >
                {text}
              </div>
            }
          >
            <Text
              ellipsis
              style={{
                display: 'block',
                maxWidth: 280,
                cursor: 'pointer',
              }}
            >
              {text}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => (
        <Tag color={priorityColors[priority]}>{priority}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusColors[status]}>{status}</Tag>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date) => dayjs(date).format('MMM D, YYYY'),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('MMM D, YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {record.status !== 'Completed' && (
            <Button
              size="small"
              icon={<CheckOutlined />}
              onClick={() => onMarkCompleted(record)}
              loading={actionLoading}
            >
              Complete
            </Button>
          )}

          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete this task?"
            description="This action cannot be undone."
            onConfirm={() => onDelete(record._id)}
            okText="Delete"
            okButtonProps={{ danger: true }}
            cancelText="Cancel"
          >
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              loading={actionLoading}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      dataSource={tasks}
      columns={columns}
      rowKey="_id"
      pagination={false}
      scroll={{ x: 'max-content' }}
    />
  );
};

export default TaskList;
