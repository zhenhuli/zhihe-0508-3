import React from 'react';
import { Row, Col, Table, Tag } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const RankingList = ({ regionData, productData }) => {
  const formatMoney = (value) => {
    if (value >= 100000000) {
      return `${(value / 100000000).toFixed(2)}亿`;
    } else if (value >= 10000) {
      return `${(value / 10000).toFixed(2)}万`;
    }
    return value.toLocaleString();
  };

  const formatNumber = (value) => {
    if (value >= 10000) {
      return `${(value / 10000).toFixed(2)}万`;
    }
    return value.toLocaleString();
  };

  const getRankTag = (rank) => {
    const colors = ['#ffd700', '#c0c0c0', '#cd7f32'];
    const bgColors = [
      'rgba(255, 215, 0, 0.3)',
      'rgba(192, 192, 192, 0.3)',
      'rgba(205, 127, 50, 0.3)'
    ];
    
    if (rank <= 3) {
      return (
        <Tag 
          color={colors[rank - 1]}
          style={{ 
            fontWeight: 'bold',
            fontSize: '14px',
            background: bgColors[rank - 1],
            border: `1px solid ${colors[rank - 1]}`,
            boxShadow: `0 0 10px ${colors[rank - 1]}40`
          }}
        >
          NO.{rank}
        </Tag>
      );
    }
    return (
      <Tag style={{ 
        fontWeight: 'bold',
        background: 'rgba(136, 153, 170, 0.2)',
        border: '1px solid #8899aa'
      }}>
        NO.{rank}
      </Tag>
    );
  };

  const getGrowthTag = (growth) => {
    const isPositive = growth >= 0;
    return (
      <Tag 
        color={isPositive ? 'success' : 'error'}
        icon={isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        style={{ 
          background: isPositive ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 71, 87, 0.2)',
          border: `1px solid ${isPositive ? '#00ff88' : '#ff4757'}`
        }}
      >
        {Math.abs(growth)}%
      </Tag>
    );
  };

  const commonTableProps = {
    pagination: false,
    size: 'small',
    showHeader: true,
    scroll: { y: 200 }
  };

  const regionColumns = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      align: 'center',
      render: (rank) => getRankTag(rank)
    },
    {
      title: '区域',
      dataIndex: 'region',
      key: 'region',
      width: 100,
      render: (text) => <span style={{ color: '#fff' }}>{text}</span>
    },
    {
      title: '营收',
      dataIndex: 'revenue',
      key: 'revenue',
      width: 100,
      render: (value) => (
        <span style={{ 
          fontWeight: 'bold', 
          color: '#00c8ff',
          textShadow: '0 0 8px rgba(0, 200, 255, 0.5)'
        }}>
          ¥{formatMoney(value)}
        </span>
      )
    },
    {
      title: '订单数',
      dataIndex: 'orders',
      key: 'orders',
      width: 80,
      render: (value) => <span style={{ color: '#8899aa' }}>{formatNumber(value)}</span>
    },
    {
      title: '增长率',
      dataIndex: 'growth',
      key: 'growth',
      width: 100,
      align: 'center',
      render: (growth) => getGrowthTag(growth)
    }
  ];

  const productColumns = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      align: 'center',
      render: (rank) => getRankTag(rank)
    },
    {
      title: '产品',
      dataIndex: 'product',
      key: 'product',
      width: 130,
      ellipsis: true,
      render: (text) => <span style={{ color: '#fff' }}>{text}</span>
    },
    {
      title: '销量',
      dataIndex: 'sales',
      key: 'sales',
      width: 80,
      render: (value) => <span style={{ color: '#8899aa' }}>{formatNumber(value)}</span>
    },
    {
      title: '营收',
      dataIndex: 'revenue',
      key: 'revenue',
      width: 100,
      render: (value) => (
        <span style={{ 
          fontWeight: 'bold', 
          color: '#00ff88',
          textShadow: '0 0 8px rgba(0, 255, 136, 0.5)'
        }}>
          ¥{formatMoney(value)}
        </span>
      )
    },
    {
      title: '增长率',
      dataIndex: 'growth',
      key: 'growth',
      width: 100,
      align: 'center',
      render: (growth) => getGrowthTag(growth)
    }
  ];

  const TableCard = ({ data, columns, title }) => (
    <div 
      className="dashboard-card"
      style={{ 
        padding: '20px',
        height: '100%'
      }}
    >
      <div className="card-corner card-corner-tl"></div>
      <div className="card-corner card-corner-tr"></div>
      <div className="card-corner card-corner-bl"></div>
      <div className="card-corner card-corner-br"></div>
      
      <div style={{ 
        marginBottom: '15px',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#00c8ff',
        textShadow: '0 0 10px rgba(0, 200, 255, 0.5)',
        letterSpacing: '2px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <span style={{ 
          width: '4px', 
          height: '18px', 
          background: 'linear-gradient(180deg, #00c8ff, #00ff88)',
          marginRight: '10px',
          borderRadius: '2px'
        }}></span>
        {title}
      </div>
      
      <Table
        columns={columns}
        dataSource={data}
        rowKey="rank"
        {...commonTableProps}
      />
    </div>
  );

  return (
    <Row gutter={[20, 20]} style={{ marginTop: '20px' }}>
      <Col xs={24} lg={12}>
        <TableCard 
          data={regionData} 
          columns={regionColumns}
          title="区域营收排行"
        />
      </Col>
      <Col xs={24} lg={12}>
        <TableCard 
          data={productData} 
          columns={productColumns}
          title="热销产品排行"
        />
      </Col>
    </Row>
  );
};

export default RankingList;
