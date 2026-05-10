const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
const PLANS_FILE = path.join(DATA_DIR, 'plans.json');
const MEMBERS_FILE = path.join(DATA_DIR, 'members.json');
const RECORDS_FILE = path.join(DATA_DIR, 'records.json');

function readData(filePath) {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  return data ? JSON.parse(data) : [];
}

function writeData(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function updateMemberStatus(members) {
  const now = new Date();
  return members.map(member => {
    if (member.status === 'expired') return member;
    const expireDate = new Date(member.expireDate);
    if (expireDate < now) {
      return { ...member, status: 'expired' };
    }
    return member;
  });
}

app.get('/api/plans', (req, res) => {
  const plans = readData(PLANS_FILE);
  res.json(plans);
});

app.post('/api/plans', (req, res) => {
  const plans = readData(PLANS_FILE);
  const { name, duration, durationType, price, description } = req.body;
  
  if (!name || !duration || !price) {
    return res.status(400).json({ error: '名称、时长和价格为必填项' });
  }
  
  const newPlan = {
    id: generateId(),
    name,
    duration: parseInt(duration),
    durationType: durationType || 'month',
    price: parseFloat(price),
    description: description || '',
    createdAt: new Date().toISOString()
  };
  
  plans.push(newPlan);
  writeData(PLANS_FILE, plans);
  res.json(newPlan);
});

app.put('/api/plans/:id', (req, res) => {
  const plans = readData(PLANS_FILE);
  const { name, duration, durationType, price, description } = req.body;
  const index = plans.findIndex(p => p.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: '套餐不存在' });
  }
  
  plans[index] = {
    ...plans[index],
    name: name || plans[index].name,
    duration: duration ? parseInt(duration) : plans[index].duration,
    durationType: durationType || plans[index].durationType,
    price: price ? parseFloat(price) : plans[index].price,
    description: description !== undefined ? description : plans[index].description,
    updatedAt: new Date().toISOString()
  };
  
  writeData(PLANS_FILE, plans);
  res.json(plans[index]);
});

app.delete('/api/plans/:id', (req, res) => {
  let plans = readData(PLANS_FILE);
  const members = readData(MEMBERS_FILE);
  
  const hasMember = members.some(m => m.planId === req.params.id);
  if (hasMember) {
    return res.status(400).json({ error: '该套餐已有会员使用，无法删除' });
  }
  
  plans = plans.filter(p => p.id !== req.params.id);
  writeData(PLANS_FILE, plans);
  res.json({ success: true });
});

app.get('/api/members', (req, res) => {
  let members = readData(MEMBERS_FILE);
  const plans = readData(PLANS_FILE);
  
  members = updateMemberStatus(members);
  writeData(MEMBERS_FILE, members);
  
  const { page = 1, pageSize = 10, status, keyword } = req.query;
  
  let filtered = members;
  
  if (status) {
    filtered = filtered.filter(m => m.status === status);
  }
  
  if (keyword) {
    const kw = keyword.toLowerCase();
    filtered = filtered.filter(m => 
      m.name.toLowerCase().includes(kw) || 
      m.phone.includes(kw) ||
      m.memberNo.toLowerCase().includes(kw)
    );
  }
  
  const total = filtered.length;
  const start = (parseInt(page) - 1) * parseInt(pageSize);
  const data = filtered.slice(start, start + parseInt(pageSize));
  
  const membersWithPlan = data.map(member => ({
    ...member,
    plan: plans.find(p => p.id === member.planId)
  }));
  
  res.json({
    data: membersWithPlan,
    total,
    page: parseInt(page),
    pageSize: parseInt(pageSize)
  });
});

app.get('/api/members/:id', (req, res) => {
  let members = readData(MEMBERS_FILE);
  const plans = readData(PLANS_FILE);
  
  members = updateMemberStatus(members);
  writeData(MEMBERS_FILE, members);
  
  const member = members.find(m => m.id === req.params.id);
  if (!member) {
    return res.status(404).json({ error: '会员不存在' });
  }
  
  res.json({
    ...member,
    plan: plans.find(p => p.id === member.planId)
  });
});

app.post('/api/members', (req, res) => {
  const members = readData(MEMBERS_FILE);
  const plans = readData(PLANS_FILE);
  const records = readData(RECORDS_FILE);
  
  const { name, phone, planId } = req.body;
  
  if (!name || !phone || !planId) {
    return res.status(400).json({ error: '姓名、手机号和套餐为必填项' });
  }
  
  const plan = plans.find(p => p.id === planId);
  if (!plan) {
    return res.status(400).json({ error: '套餐不存在' });
  }
  
  const existing = members.find(m => m.phone === phone && m.status !== 'expired');
  if (existing) {
    return res.status(400).json({ error: '该手机号已有未过期会员' });
  }
  
  const now = new Date();
  let expireDate = new Date(now);
  
  if (plan.durationType === 'day') {
    expireDate.setDate(expireDate.getDate() + plan.duration);
  } else if (plan.durationType === 'month') {
    expireDate.setMonth(expireDate.getMonth() + plan.duration);
  } else if (plan.durationType === 'year') {
    expireDate.setFullYear(expireDate.getFullYear() + plan.duration);
  }
  
  const memberNo = 'M' + now.getFullYear() + String(now.getMonth() + 1).padStart(2, '0') + 
    String(members.length + 1).padStart(6, '0');
  
  const newMember = {
    id: generateId(),
    memberNo,
    name,
    phone,
    planId,
    status: 'active',
    startDate: now.toISOString(),
    expireDate: expireDate.toISOString(),
    createdAt: now.toISOString()
  };
  
  const newRecord = {
    id: generateId(),
    memberId: newMember.id,
    memberName: name,
    memberNo,
    planId,
    planName: plan.name,
    type: 'new',
    amount: plan.price,
    startDate: now.toISOString(),
    expireDate: expireDate.toISOString(),
    createdAt: now.toISOString()
  };
  
  members.push(newMember);
  records.push(newRecord);
  
  writeData(MEMBERS_FILE, members);
  writeData(RECORDS_FILE, records);
  
  res.json({
    ...newMember,
    plan
  });
});

app.post('/api/members/:id/renew', (req, res) => {
  let members = readData(MEMBERS_FILE);
  const plans = readData(PLANS_FILE);
  const records = readData(RECORDS_FILE);
  
  const index = members.findIndex(m => m.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: '会员不存在' });
  }
  
  const { planId } = req.body;
  const plan = planId ? plans.find(p => p.id === planId) : plans.find(p => p.id === members[index].planId);
  
  if (!plan) {
    return res.status(400).json({ error: '套餐不存在' });
  }
  
  const now = new Date();
  const currentExpireDate = new Date(members[index].expireDate);
  const startDate = currentExpireDate > now ? currentExpireDate : now;
  
  let newExpireDate = new Date(startDate);
  if (plan.durationType === 'day') {
    newExpireDate.setDate(newExpireDate.getDate() + plan.duration);
  } else if (plan.durationType === 'month') {
    newExpireDate.setMonth(newExpireDate.getMonth() + plan.duration);
  } else if (plan.durationType === 'year') {
    newExpireDate.setFullYear(newExpireDate.getFullYear() + plan.duration);
  }
  
  members[index] = {
    ...members[index],
    planId: plan.id,
    status: 'active',
    expireDate: newExpireDate.toISOString(),
    updatedAt: now.toISOString()
  };
  
  const newRecord = {
    id: generateId(),
    memberId: members[index].id,
    memberName: members[index].name,
    memberNo: members[index].memberNo,
    planId: plan.id,
    planName: plan.name,
    type: 'renew',
    amount: plan.price,
    startDate: startDate.toISOString(),
    expireDate: newExpireDate.toISOString(),
    createdAt: now.toISOString()
  };
  
  records.push(newRecord);
  writeData(MEMBERS_FILE, members);
  writeData(RECORDS_FILE, records);
  
  res.json({
    ...members[index],
    plan
  });
});

app.get('/api/records', (req, res) => {
  const records = readData(RECORDS_FILE);
  const { type, keyword, startDate, endDate, page = 1, pageSize = 10 } = req.query;
  
  let filtered = [...records].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  if (type) {
    filtered = filtered.filter(r => r.type === type);
  }
  
  if (keyword) {
    const kw = keyword.toLowerCase();
    filtered = filtered.filter(r => 
      r.memberName.toLowerCase().includes(kw) || 
      r.memberNo.toLowerCase().includes(kw) ||
      r.planName.toLowerCase().includes(kw)
    );
  }
  
  if (startDate) {
    filtered = filtered.filter(r => new Date(r.createdAt) >= new Date(startDate));
  }
  
  if (endDate) {
    const end = new Date(endDate);
    end.setDate(end.getDate() + 1);
    filtered = filtered.filter(r => new Date(r.createdAt) < end);
  }
  
  const total = filtered.length;
  const start = (parseInt(page) - 1) * parseInt(pageSize);
  const data = filtered.slice(start, start + parseInt(pageSize));
  
  res.json({
    data,
    total,
    page: parseInt(page),
    pageSize: parseInt(pageSize)
  });
});

app.get('/api/stats/daily', (req, res) => {
  const members = readData(MEMBERS_FILE);
  const { days = 30 } = req.query;
  
  const dailyData = [];
  const now = new Date();
  
  for (let i = parseInt(days) - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    
    const newCount = members.filter(m => {
      const created = new Date(m.createdAt);
      return created >= date && created < nextDate;
    }).length;
    
    const expireCount = members.filter(m => {
      const expire = new Date(m.expireDate);
      return expire >= date && expire < nextDate;
    }).length;
    
    dailyData.push({
      date: dateStr,
      newCount,
      expireCount
    });
  }
  
  res.json(dailyData);
});

app.get('/api/stats/summary', (req, res) => {
  let members = readData(MEMBERS_FILE);
  const plans = readData(PLANS_FILE);
  const records = readData(RECORDS_FILE);
  
  members = updateMemberStatus(members);
  
  const activeCount = members.filter(m => m.status === 'active').length;
  const expiredCount = members.filter(m => m.status === 'expired').length;
  
  const now = new Date();
  const sevenDaysLater = new Date(now);
  sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
  
  const expiringCount = members.filter(m => {
    if (m.status !== 'active') return false;
    const expire = new Date(m.expireDate);
    return expire >= now && expire <= sevenDaysLater;
  }).length;
  
  const totalRevenue = records.reduce((sum, r) => sum + r.amount, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayRevenue = records
    .filter(r => new Date(r.createdAt) >= today)
    .reduce((sum, r) => sum + r.amount, 0);
  
  res.json({
    activeCount,
    expiredCount,
    expiringCount,
    totalRevenue,
    todayRevenue,
    totalPlans: plans.length,
    totalMembers: members.length
  });
});

app.get('/api/members/expiring', (req, res) => {
  let members = readData(MEMBERS_FILE);
  const plans = readData(PLANS_FILE);
  const { days = 7 } = req.query;
  
  members = updateMemberStatus(members);
  
  const now = new Date();
  const targetDate = new Date(now);
  targetDate.setDate(targetDate.getDate() + parseInt(days));
  
  const expiring = members.filter(m => {
    if (m.status !== 'active') return false;
    const expire = new Date(m.expireDate);
    return expire >= now && expire <= targetDate;
  }).sort((a, b) => new Date(a.expireDate) - new Date(b.expireDate));
  
  const result = expiring.map(member => ({
    ...member,
    plan: plans.find(p => p.id === member.planId),
    daysLeft: Math.ceil((new Date(member.expireDate) - now) / (1000 * 60 * 60 * 24))
  }));
  
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`会员订阅管理系统后端服务运行在 http://localhost:${PORT}`);
});
