import React, { useState, useEffect } from 'react';
import { Row, Col, Select, Typography, Space, Divider } from 'antd';
import { DashboardOutlined, ClockCircleOutlined, GlobalOutlined, DatabaseOutlined } from '@ant-design/icons';
import StatCard from './components/StatCard';
import TrendChart from './components/TrendChart';
import PieChart from './components/PieChart';
import RankingList from './components/RankingList';
import {
  generateTrendData,
  getOverviewData,
  getChannelDistribution,
  getProductDistribution,
  getRegionRanking,
  getProductRanking
} from './data/mockData';

const { Title, Text } = Typography;
const { Option } = Select;

const App = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [trendData, setTrendData] = useState(null);
  const [overviewData, setOverviewData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [productData, setProductData] = useState(null);
  const [regionRanking, setRegionRanking] = useState(null);
  const [productRanking, setProductRanking] = useState(null);

  useEffect(() => {
    setTrendData(generateTrendData(timeRange));
    setOverviewData(getOverviewData(timeRange));
    setChannelData(getChannelDistribution());
    setProductData(getProductDistribution());
    setRegionRanking(getRegionRanking());
    setProductRanking(getProductRanking());
  }, [timeRange]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
  };

  const formatDateTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0d1424 100%)',
      overflow: 'hidden',
      padding: '10px 20px 20px',
      position: 'relative'
    }}>
      {/* 背景装饰 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 10% 20%, rgba(0, 200, 255, 0.08) 0%, transparent 40%),
          radial-gradient(circle at 90% 80%, rgba(0, 255, 136, 0.08) 0%, transparent 40%),
          radial-gradient(circle at 50% 50%, rgba(255, 107, 157, 0.05) 0%, transparent 50%)
        `,
        pointerEvents: 'none'
      }} />

      {/* 顶部装饰线 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, transparent, #00c8ff, #00ff88, #ff6b9d, #ffd93d, #00c8ff, transparent)',
        opacity: 0.8
      }} />

      {/* 顶部标题栏 */}
      <Row align="middle" justify="space-between" style={{ marginBottom: '15px' }}>
        <Col>
          <Space size="large" align="center">
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00c8ff, #00ff88)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 30px rgba(0, 200, 255, 0.5)',
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              <DashboardOutlined style={{ fontSize: '28px', color: '#fff' }} />
            </div>
            <div>
              <Title 
                level={2} 
                style={{ 
                  margin: 0, 
                  color: '#fff',
                  textShadow: '0 0 20px rgba(0, 200, 255, 0.8), 0 0 40px rgba(0, 255, 136, 0.4)',
                  letterSpacing: '4px',
                  fontWeight: 'bold'
                }}
              >
                企业运营数据中心
              </Title>
              <Text style={{ color: '#8899aa', letterSpacing: '2px', fontSize: '12px' }}>
                ENTERPRISE OPERATIONS DATA CENTER
              </Text>
            </div>
          </Space>
        </Col>
        
        <Col>
          <Space size="large" align="center">
            <Space align="center">
              <GlobalOutlined style={{ color: '#00c8ff', fontSize: '16px' }} />
              <Text style={{ color: '#8899aa', fontSize: '14px' }}>数据实时同步</Text>
            </Space>
            <Divider type="vertical" style={{ background: 'rgba(0, 200, 255, 0.3)', height: '30px' }} />
            <Space align="center">
              <DatabaseOutlined style={{ color: '#00ff88', fontSize: '16px' }} />
              <Text style={{ color: '#8899aa', fontSize: '14px' }}>数据源正常</Text>
            </Space>
            <Divider type="vertical" style={{ background: 'rgba(0, 200, 255, 0.3)', height: '30px' }} />
            <Space align="center">
              <ClockCircleOutlined style={{ color: '#ffd93d', fontSize: '18px' }} />
              <Text style={{ 
                color: '#fff', 
                fontSize: '18px', 
                fontWeight: 'bold',
                fontFamily: 'monospace',
                textShadow: '0 0 10px rgba(255, 217, 61, 0.5)'
              }}>
                {formatDateTime(currentTime)}
              </Text>
            </Space>
          </Space>
        </Col>
      </Row>

      {/* 筛选器 */}
      <Row justify="center" style={{ marginBottom: '15px' }}>
        <Space align="center" size="middle">
          <Text style={{ color: '#8899aa' }}>统计周期：</Text>
          <Select
            value={timeRange}
            onChange={handleTimeRangeChange}
            style={{ width: 140 }}
            size="large"
            variant="outlined"
            style={{
              width: 140,
              background: 'rgba(15, 25, 50, 0.8)',
              borderColor: 'rgba(0, 200, 255, 0.5)',
              borderRadius: '4px'
            }}
          >
            <Option value="day">今日</Option>
            <Option value="week">本周</Option>
            <Option value="month">本月</Option>
            <Option value="quarter">本季度</Option>
          </Select>
        </Space>
      </Row>

      {/* 内容区域 */}
      <div style={{ 
        height: 'calc(100vh - 140px)',
        overflow: 'auto',
        paddingRight: '10px'
      }}>
        {/* 统计卡片 */}
        {overviewData && (
          <div style={{ marginBottom: '20px' }}>
            <StatCard data={overviewData} />
          </div>
        )}

        {/* 趋势图 */}
        <Row gutter={[20, 20]} style={{ marginBottom: '20px' }}>
          <Col xs={24} lg={24} style={{ height: '350px' }}>
            {trendData && <TrendChart data={trendData} />}
          </Col>
        </Row>

        {/* 饼图和排行榜 */}
        <Row gutter={[20, 20]}>
          <Col xs={24} lg={12}>
            {channelData && productData && (
              <PieChart channelData={channelData} productData={productData} />
            )}
          </Col>
          <Col xs={24} lg={12}>
            {regionRanking && productRanking && (
              <RankingList regionData={regionRanking} productData={productRanking} />
            )}
          </Col>
        </Row>
      </div>

      {/* 底部装饰线 */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, transparent, #00c8ff, #00ff88, #ff6b9d, #ffd93d, #00c8ff, transparent)',
        opacity: 0.8
      }} />

      {/* 自定义样式 */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 30px rgba(0, 200, 255, 0.5);
          }
          50% {
            box-shadow: 0 0 50px rgba(0, 200, 255, 0.8), 0 0 30px rgba(0, 255, 136, 0.5);
          }
        }

        /* 自定义表格样式 */
        .ant-table {
          background: transparent !important;
        }
        .ant-table-thead > tr > th {
          background: rgba(0, 200, 255, 0.1) !important;
          border-bottom: 1px solid rgba(0, 200, 255, 0.2) !important;
          color: #00c8ff !important;
          font-weight: bold;
        }
        .ant-table-tbody > tr > td {
          border-bottom: 1px solid rgba(0, 200, 255, 0.1) !important;
        }
        .ant-table-tbody > tr:hover > td {
          background: rgba(0, 200, 255, 0.1) !important;
        }
        .ant-table-wrapper .ant-table {
          background: transparent !important;
        }

        /* 自定义滚动条 */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(0, 200, 255, 0.1);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #00c8ff, #00ff88);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #00a8e8, #00e876);
        }

        /* 选择器样式 */
        .ant-select-selector {
          background: rgba(15, 25, 50, 0.9) !important;
          border: 1px solid rgba(0, 200, 255, 0.4) !important;
          color: #fff !important;
        }
        .ant-select-selection-item {
          color: #fff !important;
        }
        .ant-select-arrow {
          color: #00c8ff !important;
        }
        .ant-select-dropdown {
          background: rgba(15, 25, 50, 0.95) !important;
          border: 1px solid rgba(0, 200, 255, 0.3) !important;
        }
        .ant-select-item-option-content {
          color: #fff !important;
        }
        .ant-select-item-option-selected {
          background: rgba(0, 200, 255, 0.2) !important;
        }
        .ant-select-item-option-active {
          background: rgba(0, 200, 255, 0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default App;
