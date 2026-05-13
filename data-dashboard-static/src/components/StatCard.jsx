import React from 'react';
import { Row, Col } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, DollarOutlined, ShoppingCartOutlined, UserOutlined, BarChartOutlined } from '@ant-design/icons';

const StatCard = ({ data }) => {
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

  const GrowthIndicator = ({ growth, color }) => {
    const isPositive = growth >= 0;
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        fontSize: '14px',
        color: isPositive ? '#00ff88' : '#ff4757',
        marginTop: '8px'
      }}>
        {isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        <span style={{ marginLeft: '4px', fontWeight: 'bold' }}>
          {Math.abs(growth)}%
        </span>
      </div>
    );
  };

  const CardItem = ({ title, value, icon, growth, color, unit = '' }) => (
    <div 
      className="dashboard-card"
      style={{ 
        padding: '20px 24px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <div className="card-corner card-corner-tl"></div>
      <div className="card-corner card-corner-tr"></div>
      <div className="card-corner card-corner-bl"></div>
      <div className="card-corner card-corner-br"></div>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ 
          color: '#8899aa', 
          fontSize: '14px',
          letterSpacing: '1px'
        }}>
          {title}
        </span>
        <span style={{ 
          fontSize: '28px',
          color: color,
          filter: `drop-shadow(0 0 8px ${color})`
        }}>
          {icon}
        </span>
      </div>
      
      <div style={{ marginTop: '16px' }}>
        <div 
          style={{ 
            fontSize: '36px',
            fontWeight: 'bold',
            color: color,
            textShadow: `0 0 20px ${color}`,
            letterSpacing: '2px',
            animation: 'numberPulse 2s ease-in-out infinite'
          }}
        >
          {unit}{value}
        </div>
        <GrowthIndicator growth={growth} color={color} />
      </div>
    </div>
  );

  return (
    <Row gutter={[20, 20]}>
      <Col xs={24} sm={12} lg={6}>
        <CardItem
          title="总营收"
          value={formatMoney(data.totalRevenue)}
          icon={<DollarOutlined />}
          growth={data.revenueGrowth}
          color="#00c8ff"
          unit="¥"
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <CardItem
          title="订单数量"
          value={formatNumber(data.totalOrders)}
          icon={<ShoppingCartOutlined />}
          growth={data.orderGrowth}
          color="#00ff88"
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <CardItem
          title="用户数量"
          value={formatNumber(data.totalUsers)}
          icon={<UserOutlined />}
          growth={data.userGrowth}
          color="#ff6b9d"
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <CardItem
          title="客单价"
          value={data.avgOrderValue}
          icon={<BarChartOutlined />}
          growth={data.avgOrderGrowth}
          color="#ffd93d"
          unit="¥"
        />
      </Col>
    </Row>
  );
};

export default StatCard;
