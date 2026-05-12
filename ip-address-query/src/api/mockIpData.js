const mockIpDatabase = {
  '8.8.8.8': {
    ip: '8.8.8.8',
    country: '美国',
    region: '加利福尼亚州',
    city: '山景城',
    isp: 'Google LLC',
    networkType: '骨干网',
    timezone: 'UTC-8'
  },
  '1.1.1.1': {
    ip: '1.1.1.1',
    country: '美国',
    region: '加利福尼亚州',
    city: '旧金山',
    isp: 'Cloudflare Inc',
    networkType: 'CDN节点',
    timezone: 'UTC-8'
  },
  '114.114.114.114': {
    ip: '114.114.114.114',
    country: '中国',
    region: '江苏省',
    city: '南京市',
    isp: '南京信风网络',
    networkType: '公共DNS',
    timezone: 'UTC+8'
  },
  '223.5.5.5': {
    ip: '223.5.5.5',
    country: '中国',
    region: '浙江省',
    city: '杭州市',
    isp: '阿里云',
    networkType: '公共DNS',
    timezone: 'UTC+8'
  },
  '180.76.76.76': {
    ip: '180.76.76.76',
    country: '中国',
    region: '北京市',
    city: '北京市',
    isp: '百度云',
    networkType: '公共DNS',
    timezone: 'UTC+8'
  },
  'baidu.com': {
    ip: '110.242.68.66',
    country: '中国',
    region: '北京市',
    city: '北京市',
    isp: '百度在线网络技术',
    networkType: '数据中心',
    timezone: 'UTC+8'
  },
  'google.com': {
    ip: '142.251.43.14',
    country: '美国',
    region: '加利福尼亚州',
    city: '山景城',
    isp: 'Google LLC',
    networkType: '数据中心',
    timezone: 'UTC-8'
  },
  'github.com': {
    ip: '20.205.243.166',
    country: '美国',
    region: '华盛顿州',
    city: '西雅图',
    isp: 'Microsoft Corporation',
    networkType: '云服务',
    timezone: 'UTC-8'
  },
  'taobao.com': {
    ip: '140.205.220.96',
    country: '中国',
    region: '浙江省',
    city: '杭州市',
    isp: '阿里巴巴',
    networkType: '电商平台',
    timezone: 'UTC+8'
  },
  'qq.com': {
    ip: '183.3.226.35',
    country: '中国',
    region: '广东省',
    city: '深圳市',
    isp: '腾讯科技',
    networkType: '数据中心',
    timezone: 'UTC+8'
  }
}

const regions = [
  { country: '中国', regions: ['北京市', '上海市', '广东省', '浙江省', '江苏省', '四川省', '湖北省', '山东省'] },
  { country: '美国', regions: ['加利福尼亚州', '华盛顿州', '纽约州', '德克萨斯州', '佛罗里达州'] },
  { country: '日本', regions: ['东京都', '大阪府', '神奈川县'] },
  { country: '韩国', regions: ['首尔特别市', '釜山广域市'] },
  { country: '英国', regions: ['伦敦', '曼彻斯特'] },
  { country: '德国', regions: ['柏林', '慕尼黑'] }
]

const cities = {
  '北京市': ['北京市'],
  '上海市': ['上海市'],
  '广东省': ['广州市', '深圳市', '东莞市', '佛山市'],
  '浙江省': ['杭州市', '宁波市', '温州市'],
  '江苏省': ['南京市', '苏州市', '无锡市'],
  '四川省': ['成都市', '绵阳市'],
  '湖北省': ['武汉市', '宜昌市'],
  '山东省': ['济南市', '青岛市'],
  '加利福尼亚州': ['洛杉矶', '旧金山', '圣何塞', '山景城'],
  '华盛顿州': ['西雅图', '贝尔维尤'],
  '纽约州': ['纽约市'],
  '德克萨斯州': ['休斯顿', '达拉斯'],
  '佛罗里达州': ['迈阿密', '奥兰多'],
  '东京都': ['东京'],
  '大阪府': ['大阪'],
  '神奈川县': ['横滨'],
  '首尔特别市': ['首尔'],
  '釜山广域市': ['釜山'],
  '伦敦': ['伦敦'],
  '曼彻斯特': ['曼彻斯特'],
  '柏林': ['柏林'],
  '慕尼黑': ['慕尼黑']
}

const isps = [
  '中国电信', '中国移动', '中国联通', '阿里云', '腾讯云', '华为云',
  '百度云', '京东云', 'Google LLC', 'Amazon Technologies',
  'Microsoft Corporation', 'Cloudflare Inc', 'Apple Inc'
]

const networkTypes = ['宽带', '4G', '5G', '光纤', '数据中心', '云服务', 'CDN节点', '公共DNS', '骨干网', '企业专线']

function generateRandomIp() {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
}

function generateRandomIpInfo(input) {
  const regionData = regions[Math.floor(Math.random() * regions.length)]
  const region = regionData.regions[Math.floor(Math.random() * regionData.regions.length)]
  const cityList = cities[region] || [region]
  const city = cityList[Math.floor(Math.random() * cityList.length)]
  
  return {
    ip: input.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/) ? input : generateRandomIp(),
    country: regionData.country,
    region: region,
    city: city,
    isp: isps[Math.floor(Math.random() * isps.length)],
    networkType: networkTypes[Math.floor(Math.random() * networkTypes.length)],
    timezone: regionData.country === '中国' ? 'UTC+8' : 'UTC' + (Math.random() > 0.5 ? '+' : '-') + Math.floor(Math.random() * 12)
  }
}

export function queryIp(input) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const cleanInput = input.trim().toLowerCase()
      
      if (!cleanInput) {
        reject(new Error('请输入IP地址或域名'))
        return
      }
      
      const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/
      const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/
      
      if (!ipRegex.test(cleanInput) && !domainRegex.test(cleanInput)) {
        reject(new Error('请输入有效的IP地址或域名'))
        return
      }
      
      if (mockIpDatabase[cleanInput]) {
        resolve({ success: true, data: { ...mockIpDatabase[cleanInput], queryTime: new Date().toISOString() } })
      } else {
        const randomInfo = generateRandomIpInfo(cleanInput)
        resolve({ success: true, data: { ...randomInfo, queryTime: new Date().toISOString() } })
      }
    }, 500 + Math.random() * 500)
  })
}

export function batchQueryIp(inputs) {
  return new Promise((resolve) => {
    const cleanInputs = inputs.map(input => input.trim().toLowerCase()).filter(input => input)
    const results = []
    
    cleanInputs.forEach((input, index) => {
      setTimeout(() => {
        const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/
        const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/
        
        if (!ipRegex.test(input) && !domainRegex.test(input)) {
          results.push({ input, success: false, error: '无效的IP地址或域名' })
        } else if (mockIpDatabase[input]) {
          results.push({ input, success: true, data: { ...mockIpDatabase[input], queryTime: new Date().toISOString() } })
        } else {
          const randomInfo = generateRandomIpInfo(input)
          results.push({ input, success: true, data: { ...randomInfo, queryTime: new Date().toISOString() } })
        }
        
        if (results.length === cleanInputs.length) {
          resolve(results)
        }
      }, (index + 1) * 200)
    })
    
    if (cleanInputs.length === 0) {
      resolve([])
    }
  })
}
