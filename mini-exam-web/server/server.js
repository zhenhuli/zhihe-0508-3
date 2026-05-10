const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3010;

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

let questions = [
  {
    id: 1,
    type: 'single',
    question: 'JavaScript中，以下哪个不是原始数据类型？',
    options: ['String', 'Number', 'Array', 'Boolean'],
    answer: [2],
    explanation: 'Array是引用数据类型，不是原始数据类型'
  },
  {
    id: 2,
    type: 'single',
    question: 'Vue3中，用于定义响应式数据的API是？',
    options: ['data()', 'reactive()', 'component()', 'mounted()'],
    answer: [1],
    explanation: 'Vue3中使用reactive()和ref()来定义响应式数据'
  },
  {
    id: 3,
    type: 'multiple',
    question: '以下哪些是JavaScript的循环语句？',
    options: ['for', 'while', 'if', 'do...while'],
    answer: [0, 1, 3],
    explanation: 'for、while、do...while都是循环语句，if是条件语句'
  },
  {
    id: 4,
    type: 'multiple',
    question: 'Vue3的生命周期钩子有哪些？',
    options: ['onMounted', 'onCreated', 'onUnmounted', 'onUpdated'],
    answer: [0, 2, 3],
    explanation: 'Vue3使用onMounted、onUnmounted、onUpdated等钩子，没有onCreated，使用setup替代'
  },
  {
    id: 5,
    type: 'judge',
    question: 'JavaScript中，null == undefined 的结果是true。',
    options: ['正确', '错误'],
    answer: [0],
    explanation: '在JavaScript中，null和undefined在宽松相等比较时结果为true'
  },
  {
    id: 6,
    type: 'judge',
    question: 'Vue3的Composition API只能在setup函数中使用。',
    options: ['正确', '错误'],
    answer: [0],
    explanation: 'Composition API的核心就是在setup函数中组织逻辑'
  },
  {
    id: 7,
    type: 'single',
    question: '以下哪个HTTP状态码表示服务器内部错误？',
    options: ['200', '404', '500', '301'],
    answer: [2],
    explanation: '500表示服务器内部错误，200是成功，404是未找到，301是重定向'
  },
  {
    id: 8,
    type: 'multiple',
    question: '以下哪些是有效的CSS选择器？',
    options: ['.class', '#id', '*', '::before'],
    answer: [0, 1, 2, 3],
    explanation: '这些都是有效的CSS选择器，分别是类选择器、ID选择器、通配符选择器和伪元素选择器'
  },
  {
    id: 9,
    type: 'judge',
    question: '在Git中，git merge命令用于合并分支。',
    options: ['正确', '错误'],
    answer: [0],
    explanation: 'git merge命令确实用于将一个分支的更改合并到当前分支'
  },
  {
    id: 10,
    type: 'single',
    question: 'npm install 命令的作用是什么？',
    options: ['创建新项目', '安装依赖', '运行项目', '测试项目'],
    answer: [1],
    explanation: 'npm install用于安装package.json中定义的依赖包'
  }
];

let users = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    createdAt: new Date().toISOString()
  }
];

let sessions = new Map();
let examRecords = [];

const generateId = () => Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);

const generateToken = () => 'token_' + generateId();

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : null;
  
  if (!token) {
    return res.status(401).json({ success: false, message: '未登录' });
  }
  
  const user = sessions.get(token);
  if (!user) {
    return res.status(401).json({ success: false, message: '登录已过期' });
  }
  
  req.user = user;
  req.token = token;
  next();
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: '需要管理员权限' });
  }
  next();
};

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

app.post('/api/auth/register', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.json({ success: false, message: '请填写用户名和密码' });
  }
  
  if (username.length < 2) {
    return res.json({ success: false, message: '用户名至少2位' });
  }
  
  if (password.length < 4) {
    return res.json({ success: false, message: '密码至少4位' });
  }
  
  if (users.find(u => u.username === username)) {
    return res.json({ success: false, message: '用户名已存在' });
  }
  
  const user = {
    id: generateId(),
    username,
    password,
    role: 'user',
    createdAt: new Date().toISOString()
  };
  
  users.push(user);
  
  const token = generateToken();
  sessions.set(token, {
    id: user.id,
    username: user.username,
    role: user.role
  });
  
  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.json({ success: false, message: '请填写用户名和密码' });
  }
  
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.json({ success: false, message: '用户名或密码错误' });
  }
  
  const token = generateToken();
  sessions.set(token, {
    id: user.id,
    username: user.username,
    role: user.role
  });
  
  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    }
  });
});

app.post('/api/auth/logout', authenticate, (req, res) => {
  sessions.delete(req.token);
  res.json({ success: true, message: '已退出登录' });
});

app.get('/api/auth/me', authenticate, (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

app.get('/api/questions', authenticate, (req, res) => {
  res.json({ success: true, data: questions });
});

app.get('/api/questions/:id', authenticate, (req, res) => {
  const question = questions.find(q => 
    (typeof q.id === 'number' && q.id === parseInt(req.params.id)) || 
    String(q.id) === String(req.params.id)
  );
  if (!question) {
    return res.json({ success: false, message: '题目不存在' });
  }
  res.json({ success: true, data: question });
});

app.post('/api/questions', authenticate, requireAdmin, (req, res) => {
  const { type, question, options, answer, explanation } = req.body;
  
  if (!type || !question || !options || !answer) {
    return res.json({ success: false, message: '请填写完整信息' });
  }
  
  if (!['single', 'multiple', 'judge'].includes(type)) {
    return res.json({ success: false, message: '无效的题目类型' });
  }
  
  const newQuestion = {
    id: generateId(),
    type,
    question,
    options,
    answer,
    explanation: explanation || ''
  };
  
  questions.push(newQuestion);
  res.json({ success: true, data: newQuestion });
});

app.put('/api/questions/:id', authenticate, requireAdmin, (req, res) => {
  const id = req.params.id;
  const index = questions.findIndex(q => 
    (typeof q.id === 'number' && q.id === parseInt(id)) || 
    String(q.id) === String(id)
  );
  
  if (index === -1) {
    return res.json({ success: false, message: '题目不存在' });
  }
  
  const { type, question, options, answer, explanation } = req.body;
  
  if (type && !['single', 'multiple', 'judge'].includes(type)) {
    return res.json({ success: false, message: '无效的题目类型' });
  }
  
  questions[index] = {
    ...questions[index],
    type: type || questions[index].type,
    question: question || questions[index].question,
    options: options || questions[index].options,
    answer: answer || questions[index].answer,
    explanation: explanation !== undefined ? explanation : questions[index].explanation
  };
  
  res.json({ success: true, data: questions[index] });
});

app.delete('/api/questions/:id', authenticate, requireAdmin, (req, res) => {
  const id = req.params.id;
  const index = questions.findIndex(q => 
    (typeof q.id === 'number' && q.id === parseInt(id)) || 
    String(q.id) === String(id)
  );
  
  if (index === -1) {
    return res.json({ success: false, message: '题目不存在' });
  }
  
  questions.splice(index, 1);
  res.json({ success: true });
});

app.post('/api/exam/generate', authenticate, (req, res) => {
  const { count = 5, types = ['single', 'multiple', 'judge'] } = req.body;
  
  let availableQuestions = questions.filter(q => types.includes(q.type));
  
  if (availableQuestions.length === 0) {
    return res.json({ success: false, message: '没有可用的题目' });
  }
  
  const shuffled = shuffleArray(availableQuestions);
  const selectedQuestions = shuffled.slice(0, Math.min(count, shuffled.length));
  
  const examQuestions = selectedQuestions.map(q => ({
    id: q.id,
    type: q.type,
    question: q.question,
    options: q.options
  }));
  
  const examId = generateId();
  const answers = {};
  selectedQuestions.forEach(q => {
    answers[q.id] = q.answer;
  });
  
  res.json({ 
    success: true, 
    data: {
      examId,
      questions: examQuestions,
      totalCount: examQuestions.length
    }
  });
});

app.post('/api/exam/submit', authenticate, (req, res) => {
  const { examId, answers, timeSpent } = req.body;
  
  if (!examId || !answers) {
    return res.json({ success: false, message: '参数不完整' });
  }
  
  let correctCount = 0;
  let totalCount = 0;
  const wrongQuestions = [];
  const results = [];
  
  Object.keys(answers).forEach(questionId => {
    const question = questions.find(q => 
      (typeof q.id === 'number' && q.id === parseInt(questionId)) || 
      String(q.id) === String(questionId)
    );
    if (!question) return;
    
    totalCount++;
    const userAnswer = answers[questionId].sort();
    const correctAnswer = question.answer.sort();
    
    const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(correctAnswer);
    
    if (isCorrect) {
      correctCount++;
    } else {
      wrongQuestions.push({
        ...question,
        userAnswer: answers[questionId],
        correctAnswer: question.answer
      });
    }
    
    results.push({
      questionId: question.id,
      isCorrect,
      userAnswer: answers[questionId],
      correctAnswer: question.answer,
      question: question.question,
      options: question.options,
      explanation: question.explanation,
      type: question.type
    });
  });
  
  const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  
  const record = {
    id: examId,
    userId: req.user.id,
    username: req.user.username,
    totalCount,
    correctCount,
    accuracy,
    timeSpent: timeSpent || 0,
    wrongQuestions,
    results,
    createdAt: new Date().toISOString()
  };
  
  examRecords.push(record);
  
  res.json({
    success: true,
    data: {
      examId,
      totalCount,
      correctCount,
      accuracy,
      timeSpent: timeSpent || 0,
      wrongQuestions,
      results
    }
  });
});

app.get('/api/records', authenticate, (req, res) => {
  const userRecords = examRecords
    .filter(r => r.userId === req.user.id)
    .reverse();
  res.json({ success: true, data: userRecords });
});

app.get('/api/records/:id', authenticate, (req, res) => {
  const record = examRecords.find(r => 
    String(r.id) === String(req.params.id) && 
    r.userId === req.user.id
  );
  if (!record) {
    return res.json({ success: false, message: '记录不存在' });
  }
  res.json({ success: true, data: record });
});

app.get('/api/stats', authenticate, (req, res) => {
  const userRecords = examRecords.filter(r => r.userId === req.user.id);
  
  if (userRecords.length === 0) {
    return res.json({
      success: true,
      data: {
        totalExams: 0,
        totalQuestions: 0,
        totalCorrect: 0,
        averageAccuracy: 0,
        wrongQuestions: []
      }
    });
  }
  
  let totalQuestions = 0;
  let totalCorrect = 0;
  const wrongMap = new Map();
  
  userRecords.forEach(record => {
    totalQuestions += record.totalCount;
    totalCorrect += record.correctCount;
    
    record.wrongQuestions.forEach(q => {
      if (!wrongMap.has(q.id)) {
        wrongMap.set(q.id, {
          ...q,
          wrongCount: 0
        });
      }
      wrongMap.get(q.id).wrongCount++;
    });
  });
  
  const wrongQuestions = Array.from(wrongMap.values()).sort((a, b) => b.wrongCount - a.wrongCount);
  const averageAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  
  res.json({
    success: true,
    data: {
      totalExams: userRecords.length,
      totalQuestions,
      totalCorrect,
      averageAccuracy,
      wrongQuestions: wrongQuestions.slice(0, 20)
    }
  });
});

app.get('/api/wrong-questions', authenticate, (req, res) => {
  const userRecords = examRecords.filter(r => r.userId === req.user.id);
  const wrongMap = new Map();
  
  userRecords.forEach(record => {
    record.wrongQuestions.forEach(q => {
      if (!wrongMap.has(q.id)) {
        wrongMap.set(q.id, {
          ...q,
          wrongCount: 0,
          examRecords: []
        });
      }
      wrongMap.get(q.id).wrongCount++;
      wrongMap.get(q.id).examRecords.push({
        examId: record.id,
        userAnswer: q.userAnswer,
        correctAnswer: q.correctAnswer,
        createdAt: record.createdAt
      });
    });
  });
  
  const wrongQuestions = Array.from(wrongMap.values()).sort((a, b) => b.wrongCount - a.wrongCount);
  
  res.json({ success: true, data: wrongQuestions });
});

app.get('/api/clear', authenticate, (req, res) => {
  examRecords = examRecords.filter(r => r.userId !== req.user.id);
  res.json({ success: true, message: '已清空您的答题记录' });
});

app.listen(PORT, () => {
  console.log(`Mini Exam Server running on http://localhost:${PORT}`);
});
