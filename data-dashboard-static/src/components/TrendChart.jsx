import React from 'react';
import ReactECharts from 'echarts-for-react';

const TrendChart = ({ data }) => {
  const formatMoney = (value) => {
    if (value >= 100000000) {
      return `${(value / 100000000).toFixed(2)}亿`;
    } else if (value >= 10000) {
      return `${(value / 10000).toFixed(2)}万`;
    }
    return value.toLocaleString();
  };

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        lineStyle: {
          color: 'rgba(0, 200, 255, 0.5)'
        }
      },
      backgroundColor: 'rgba(15, 25, 50, 0.9)',
      borderColor: 'rgba(0, 200, 255, 0.5)',
      textStyle: {
        color: '#fff'
      }
    },
    legend: {
      data: ['营收', '订单数', '用户数'],
      top: 10,
      textStyle: {
        color: '#8899aa'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.xAxis,
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 200, 255, 0.3)'
        }
      },
      axisLabel: {
        color: '#8899aa'
      },
      splitLine: {
        show: false
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '营收',
        position: 'left',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#00c8ff'
          }
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(0, 200, 255, 0.1)'
          }
        },
        axisLabel: {
          color: '#8899aa',
          formatter: (value) => formatMoney(value)
        }
      },
      {
        type: 'value',
        name: '订单/用户',
        position: 'right',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#00ff88'
          }
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          color: '#8899aa'
        }
      }
    ],
    series: [
      {
        name: '营收',
        type: 'line',
        smooth: true,
        yAxisIndex: 0,
        data: data.revenue,
        itemStyle: {
          color: '#00c8ff'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(0, 200, 255, 0.4)' },
              { offset: 1, color: 'rgba(0, 200, 255, 0.05)' }
            ]
          }
        },
        lineStyle: {
          width: 3,
          shadowColor: 'rgba(0, 200, 255, 0.5)',
          shadowBlur: 10
        }
      },
      {
        name: '订单数',
        type: 'line',
        smooth: true,
        yAxisIndex: 1,
        data: data.orders,
        itemStyle: {
          color: '#00ff88'
        },
        lineStyle: {
          width: 2,
          type: 'dashed',
          shadowColor: 'rgba(0, 255, 136, 0.5)',
          shadowBlur: 8
        }
      },
      {
        name: '用户数',
        type: 'line',
        smooth: true,
        yAxisIndex: 1,
        data: data.users,
        itemStyle: {
          color: '#ff6b9d'
        },
        lineStyle: {
          width: 2,
          type: 'dotted',
          shadowColor: 'rgba(255, 107, 157, 0.5)',
          shadowBlur: 8
        }
      }
    ]
  };

  return (
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
        业务趋势分析
      </div>
      
      <ReactECharts 
        option={option} 
        style={{ height: 'calc(100% - 50px)', width: '100%' }} 
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
};

export default TrendChart;
