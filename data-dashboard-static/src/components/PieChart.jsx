import React from 'react';
import { Row, Col } from 'antd';
import ReactECharts from 'echarts-for-react';

const PieChart = ({ channelData, productData }) => {
  const getPieOption = (data, title, colors) => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}% ({d}%)',
      backgroundColor: 'rgba(15, 25, 50, 0.9)',
      borderColor: 'rgba(0, 200, 255, 0.5)',
      textStyle: {
        color: '#fff'
      }
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: {
        color: '#8899aa'
      }
    },
    series: [
      {
        name: title,
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: 'rgba(0, 0, 0, 0.3)',
          borderWidth: 2,
          shadowBlur: 20,
          shadowColor: 'rgba(0, 200, 255, 0.3)'
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 18,
            fontWeight: 'bold',
            color: '#fff',
            textShadow: '0 0 10px rgba(0, 200, 255, 0.8)'
          },
          itemStyle: {
            shadowBlur: 30,
            shadowColor: 'rgba(0, 200, 255, 0.5)'
          }
        },
        labelLine: {
          show: false
        },
        data: data.map((item, index) => ({
          ...item,
          itemStyle: {
            color: {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.5,
              colorStops: [
                { offset: 0, color: colors[index] },
                { offset: 1, color: adjustColor(colors[index], -30) }
              ]
            },
            shadowColor: colors[index],
            shadowBlur: 15
          }
        }))
      }
    ]
  });

  function adjustColor(color, amount) {
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  const channelColors = ['#00c8ff', '#00ff88', '#ff6b9d', '#ffd93d', '#c084fc'];
  const productColors = ['#06b6d4', '#fbbf24', '#ef4444', '#22c55e', '#3b82f6'];

  const PieCard = ({ data, title, colors }) => (
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
      
      <ReactECharts
        option={getPieOption(data, title, colors)}
        style={{ height: 'calc(100% - 50px)', width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );

  return (
    <Row gutter={[20, 20]}>
      <Col xs={24} lg={12}>
        <PieCard 
          data={channelData} 
          title="流量渠道分布" 
          colors={channelColors}
        />
      </Col>
      <Col xs={24} lg={12}>
        <PieCard 
          data={productData} 
          title="产品品类分布" 
          colors={productColors}
        />
      </Col>
    </Row>
  );
};

export default PieChart;
