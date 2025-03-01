'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { fetchPaymentHistory } from '../redux/slices/actionsSlice';
import { Table, Spin } from 'antd';



const PaymentHistoryComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const paymentHistory = useSelector((state: RootState) => state.action.paymentHistory) || [];
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const postIdFromUrl = urlParams.get('postId');

    const token = localStorage.getItem('token');
    if (token) {
      const fetchData = async () => {
        await dispatch(fetchPaymentHistory({ token, postId: postIdFromUrl }));
        setLoading(false);
      };
      fetchData();
    }
  }, [dispatch]);

  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      ellipsis: true,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `$${amount.toFixed(2)}`,
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      key: 'currency',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Created',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      render: (paymentDate: string) => new Date(paymentDate).toLocaleString(),
    },
    {
      title: 'Post ID',
      dataIndex: 'postId',
      key: 'postId',
      ellipsis: true,
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '55%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
        }}
      >
        <Spin size="default" />
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-7xl mx-auto">
      <h2 className="text-xl font-semibold text-center mb-6">Payment History</h2>
      <Table
        dataSource={paymentHistory}
        columns={columns}
        rowKey={(record) => record._id}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 800 }}
        className="table-responsive"
      />
    </div>
  );
};

export default PaymentHistoryComponent;
