const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3003;

const DATA_FILE = path.join(__dirname, 'data', 'resumes.json');

app.use(cors());
app.use(express.json());

function readResumes() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading resumes:', error);
    return [];
  }
}

function writeResumes(resumes) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(resumes, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing resumes:', error);
    return false;
  }
}

app.get('/api/resumes', (req, res) => {
  const resumes = readResumes();
  res.json(resumes);
});

app.get('/api/resumes/:id', (req, res) => {
  const resumes = readResumes();
  const resume = resumes.find(r => r.id === req.params.id);
  
  if (!resume) {
    return res.status(404).json({ error: 'Resume not found' });
  }
  
  res.json(resume);
});

app.post('/api/resumes', (req, res) => {
  const resumes = readResumes();
  const newResume = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  resumes.push(newResume);
  writeResumes(resumes);
  
  res.status(201).json(newResume);
});

app.put('/api/resumes/:id', (req, res) => {
  const resumes = readResumes();
  const index = resumes.findIndex(r => r.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Resume not found' });
  }
  
  resumes[index] = {
    ...resumes[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  writeResumes(resumes);
  res.json(resumes[index]);
});

app.delete('/api/resumes/:id', (req, res) => {
  const resumes = readResumes();
  const filtered = resumes.filter(r => r.id !== req.params.id);
  
  if (filtered.length === resumes.length) {
    return res.status(404).json({ error: 'Resume not found' });
  }
  
  writeResumes(filtered);
  res.json({ success: true });
});

const CHINESE_FONT_PATH = '/System/Library/Fonts/Supplemental/Arial Unicode.ttf';

function renderClassicTemplate(doc, resume) {
  const { personalInfo = {}, education = [], workExperience = [], skills = [] } = resume;
  
  if (personalInfo.name) {
    doc.fontSize(24).fillColor('#1e40af').text(personalInfo.name, { align: 'center' });
    doc.moveDown(0.3);
    
    const contactParts = [];
    if (personalInfo.email) contactParts.push(`邮箱: ${personalInfo.email}`);
    if (personalInfo.phone) contactParts.push(`电话: ${personalInfo.phone}`);
    if (personalInfo.address) contactParts.push(`地址: ${personalInfo.address}`);
    
    if (contactParts.length > 0) {
      doc.fontSize(10).fillColor('#4b5563').text(contactParts.join('  |  '), { align: 'center' });
    }
    
    if (personalInfo.summary) {
      doc.moveDown(0.5);
      doc.fontSize(11).fillColor('#374151').text(personalInfo.summary);
    }
    doc.moveDown(1);
  }
  
  const addSection = (title) => {
    doc.moveDown(0.5);
    doc.fontSize(14).fillColor('#1e40af').text(title, { underline: true });
    doc.moveDown(0.5);
  };
  
  if (education.length > 0) {
    addSection('教育经历');
    education.forEach(edu => {
      doc.fontSize(12).fillColor('#1f2937').text(edu.school, { continued: true });
      if (edu.degree || edu.major) {
        doc.fontSize(10).fillColor('#6b7280').text(`   ${[edu.degree, edu.major].filter(Boolean).join(' - ')}`, { align: 'right' });
      } else {
        doc.moveDown(0.1);
      }
      if (edu.startDate || edu.endDate) {
        doc.fontSize(10).fillColor('#6b7280').text(`${edu.startDate || ''} - ${edu.endDate || '至今'}`);
      }
      if (edu.description) doc.fontSize(10).fillColor('#374151').text(edu.description);
      doc.moveDown(0.3);
    });
  }
  
  if (workExperience.length > 0) {
    addSection('工作经历');
    workExperience.forEach(work => {
      doc.fontSize(12).fillColor('#1f2937').text(work.company, { continued: true });
      if (work.position) {
        doc.fontSize(10).fillColor('#6b7280').text(`   ${work.position}`, { align: 'right' });
      } else {
        doc.moveDown(0.1);
      }
      if (work.startDate || work.endDate) {
        doc.fontSize(10).fillColor('#6b7280').text(`${work.startDate || ''} - ${work.endDate || '至今'}`);
      }
      if (work.description) doc.fontSize(10).fillColor('#374151').text(work.description);
      doc.moveDown(0.3);
    });
  }
  
  if (skills.length > 0) {
    addSection('技能特长');
    doc.fontSize(11).fillColor('#374151').text(skills.join('  |  '));
  }
}

function renderModernTemplate(doc, resume) {
  const { personalInfo = {}, education = [], workExperience = [], skills = [] } = resume;
  const pageWidth = doc.page.width - 100;
  const sidebarWidth = 170;
  
  doc.rect(50, 50, sidebarWidth, doc.page.height - 100).fill('#1f2937');
  
  doc.fillColor('#ffffff');
  let sidebarY = 70;
  
  doc.fontSize(20).text(personalInfo.name || '姓名', 60, sidebarY, { width: sidebarWidth - 20, align: 'center' });
  sidebarY += 35;
  
  doc.fontSize(10);
  if (personalInfo.email) {
    doc.text(`邮箱`, 60, sidebarY);
    doc.fontSize(9).fillColor('#9ca3af').text(personalInfo.email, 60, sidebarY + 14, { width: sidebarWidth - 20 });
    sidebarY += 35;
    doc.fillColor('#ffffff').fontSize(10);
  }
  if (personalInfo.phone) {
    doc.text(`电话`, 60, sidebarY);
    doc.fontSize(9).fillColor('#9ca3af').text(personalInfo.phone, 60, sidebarY + 14);
    sidebarY += 35;
    doc.fillColor('#ffffff').fontSize(10);
  }
  if (personalInfo.address) {
    doc.text(`所在地`, 60, sidebarY);
    doc.fontSize(9).fillColor('#9ca3af').text(personalInfo.address, 60, sidebarY + 14);
    sidebarY += 35;
    doc.fillColor('#ffffff').fontSize(10);
  }
  
  if (skills.length > 0) {
    doc.text(`技能特长`, 60, sidebarY);
    sidebarY += 18;
    doc.fontSize(9).fillColor('#9ca3af');
    skills.forEach(skill => {
      doc.text(`• ${skill}`, 65, sidebarY, { width: sidebarWidth - 25 });
      sidebarY += 16;
    });
  }
  
  doc.fillColor('#1f2937');
  const contentX = 50 + sidebarWidth + 25;
  let contentY = 60;
  
  if (personalInfo.summary) {
    doc.fontSize(14).fillColor('#1f2937').text('个人简介', contentX, contentY);
    contentY += 8;
    doc.moveTo(contentX, contentY).lineTo(contentX + 100, contentY).stroke('#3b82f6');
    contentY += 15;
    doc.fontSize(10).fillColor('#4b5563').text(personalInfo.summary, contentX, contentY, { width: pageWidth - sidebarWidth - 35 });
    contentY += doc.heightOfString(personalInfo.summary, { width: pageWidth - sidebarWidth - 35 }) + 25;
  }
  
  const renderSection = (title, items, renderItem) => {
    if (items.length === 0) return;
    doc.fontSize(14).fillColor('#1f2937').text(title, contentX, contentY);
    contentY += 8;
    doc.moveTo(contentX, contentY).lineTo(contentX + 100, contentY).stroke('#3b82f6');
    contentY += 20;
    items.forEach(item => {
      renderItem(item, contentX, contentY);
      contentY += 55;
    });
    contentY += 10;
  };
  
  renderSection('工作经历', workExperience, (work, x, y) => {
    doc.fontSize(12).fillColor('#1f2937').text(work.company || '', x, y);
    if (work.position) {
      doc.fontSize(10).fillColor('#3b82f6').text(work.position, x, y + 17);
    }
    if (work.startDate || work.endDate) {
      doc.fontSize(9).fillColor('#6b7280').text(`${work.startDate || ''} - ${work.endDate || '至今'}`, x + 150, y);
    }
    if (work.description) {
      doc.fontSize(9).fillColor('#4b5563').text(work.description, x, y + 34, { width: pageWidth - sidebarWidth - 35 });
    }
  });
  
  renderSection('教育经历', education, (edu, x, y) => {
    doc.fontSize(12).fillColor('#1f2937').text(edu.school || '', x, y);
    if (edu.degree || edu.major) {
      doc.fontSize(10).fillColor('#3b82f6').text([edu.degree, edu.major].filter(Boolean).join(' - '), x, y + 17);
    }
    if (edu.startDate || edu.endDate) {
      doc.fontSize(9).fillColor('#6b7280').text(`${edu.startDate || ''} - ${edu.endDate || '至今'}`, x + 150, y);
    }
    if (edu.description) {
      doc.fontSize(9).fillColor('#4b5563').text(edu.description, x, y + 34, { width: pageWidth - sidebarWidth - 35 });
    }
  });
}

function renderElegantTemplate(doc, resume) {
  const { personalInfo = {}, education = [], workExperience = [], skills = [] } = resume;
  
  doc.rect(50, 50, doc.page.width - 100, 3).fill('#d97706');
  
  doc.moveDown(2);
  
  if (personalInfo.name) {
    doc.fontSize(26).fillColor('#1f2937').text(personalInfo.name, { align: 'center' });
    doc.moveDown(0.2);
    doc.fontSize(12).fillColor('#d97706').text('RESUME', { align: 'center' });
    doc.moveDown(0.8);
    
    const contactParts = [];
    if (personalInfo.email) contactParts.push(personalInfo.email);
    if (personalInfo.phone) contactParts.push(personalInfo.phone);
    if (personalInfo.address) contactParts.push(personalInfo.address);
    
    if (contactParts.length > 0) {
      doc.fontSize(10).fillColor('#6b7280').text(contactParts.join('   ·   '), { align: 'center' });
    }
    doc.moveDown(0.8);
    
    if (personalInfo.summary) {
      doc.fontSize(11).fillColor('#4b5563').text(personalInfo.summary, { align: 'center' });
    }
    doc.moveDown(1.2);
  }
  
  const addSection = (title) => {
    doc.moveDown(0.3);
    doc.fontSize(13).fillColor('#d97706').text(title);
    doc.moveDown(0.3);
    doc.fontSize(10).fillColor('#9ca3af').text('─'.repeat(60));
    doc.moveDown(0.5);
  };
  
  if (workExperience.length > 0) {
    addSection('WORK EXPERIENCE  工作经历');
    workExperience.forEach(work => {
      doc.fontSize(12).fillColor('#1f2937').text(work.company || '');
      if (work.position) {
        doc.fontSize(10).fillColor('#d97706').text(work.position);
      }
      if (work.startDate || work.endDate) {
        doc.fontSize(9).fillColor('#6b7280').text(`${work.startDate || ''} - ${work.endDate || '至今'}`);
      }
      if (work.description) {
        doc.moveDown(0.2);
        doc.fontSize(10).fillColor('#4b5563').text(work.description);
      }
      doc.moveDown(0.5);
    });
  }
  
  if (education.length > 0) {
    addSection('EDUCATION  教育经历');
    education.forEach(edu => {
      doc.fontSize(12).fillColor('#1f2937').text(edu.school || '');
      if (edu.degree || edu.major) {
        doc.fontSize(10).fillColor('#d97706').text([edu.degree, edu.major].filter(Boolean).join(' - '));
      }
      if (edu.startDate || edu.endDate) {
        doc.fontSize(9).fillColor('#6b7280').text(`${edu.startDate || ''} - ${edu.endDate || '至今'}`);
      }
      if (edu.description) {
        doc.moveDown(0.2);
        doc.fontSize(10).fillColor('#4b5563').text(edu.description);
      }
      doc.moveDown(0.5);
    });
  }
  
  if (skills.length > 0) {
    addSection('SKILLS  技能特长');
    doc.fontSize(11).fillColor('#4b5563').text(skills.join('   ·   '));
  }
}

function renderCreativeTemplate(doc, resume) {
  const { personalInfo = {}, education = [], workExperience = [], skills = [] } = resume;
  
  doc.rect(50, 50, doc.page.width - 100, 100).fill('#6366f1');
  
  doc.fillColor('#ffffff');
  if (personalInfo.name) {
    doc.fontSize(28).text(personalInfo.name, 70, 75);
    doc.fontSize(12).fillColor('#c7d2fe');
    if (personalInfo.summary) {
      doc.text(personalInfo.summary, 70, 110, { width: 350 });
    }
  }
  
  doc.fillColor('#4f46e5');
  const contactY = 75;
  let contactX = 450;
  doc.fontSize(9);
  if (personalInfo.email) {
    doc.fillColor('#e0e7ff').text(personalInfo.email, contactX, contactY);
    contactY += 18;
  }
  if (personalInfo.phone) {
    doc.fillColor('#e0e7ff').text(personalInfo.phone, contactX, contactY);
    contactY += 18;
  }
  if (personalInfo.address) {
    doc.fillColor('#e0e7ff').text(personalInfo.address, contactX, contactY);
  }
  
  let currentY = 170;
  
  const addSection = (title, icon) => {
    doc.fillColor('#6366f1');
    doc.fontSize(14).text(`${icon}  ${title}`, 50, currentY);
    currentY += 8;
    doc.moveTo(50, currentY).lineTo(doc.page.width - 50, currentY).stroke('#e0e7ff');
    currentY += 20;
  };
  
  if (workExperience.length > 0) {
    addSection('工作经历', '◆');
    workExperience.forEach(work => {
      doc.fillColor('#1f2937').fontSize(12).text(work.company || '', 50, currentY);
      if (work.position) {
        doc.fillColor('#6366f1').fontSize(10).text(work.position, 250, currentY);
      }
      currentY += 16;
      if (work.startDate || work.endDate) {
        doc.fillColor('#6b7280').fontSize(9).text(`${work.startDate || ''} - ${work.endDate || '至今'}`, 50, currentY);
      }
      currentY += 14;
      if (work.description) {
        doc.fillColor('#4b5563').fontSize(10).text(work.description, 50, currentY, { width: doc.page.width - 100 });
        currentY += doc.heightOfString(work.description, { width: doc.page.width - 100 }) + 20;
      } else {
        currentY += 20;
      }
    });
  }
  
  if (education.length > 0) {
    addSection('教育经历', '◇');
    education.forEach(edu => {
      doc.fillColor('#1f2937').fontSize(12).text(edu.school || '', 50, currentY);
      if (edu.degree || edu.major) {
        doc.fillColor('#6366f1').fontSize(10).text([edu.degree, edu.major].filter(Boolean).join(' - '), 250, currentY);
      }
      currentY += 16;
      if (edu.startDate || edu.endDate) {
        doc.fillColor('#6b7280').fontSize(9).text(`${edu.startDate || ''} - ${edu.endDate || '至今'}`, 50, currentY);
      }
      currentY += 14;
      if (edu.description) {
        doc.fillColor('#4b5563').fontSize(10).text(edu.description, 50, currentY, { width: doc.page.width - 100 });
        currentY += doc.heightOfString(edu.description, { width: doc.page.width - 100 }) + 20;
      } else {
        currentY += 20;
      }
    });
  }
  
  if (skills.length > 0) {
    addSection('技能特长', '★');
    skills.forEach((skill, i) => {
      const x = 50 + (i % 3) * 150;
      const yOffset = Math.floor(i / 3) * 22;
      doc.fillColor('#6366f1').fontSize(11).text(`● ${skill}`, x, currentY + yOffset);
    });
  }
}

const TEMPLATES = {
  classic: renderClassicTemplate,
  modern: renderModernTemplate,
  elegant: renderElegantTemplate,
  creative: renderCreativeTemplate
};

app.post('/api/pdf', (req, res) => {
  console.log('PDF生成请求收到:', new Date().toISOString());
  const resume = req.body;
  const filename = `${resume.personalInfo?.name || 'resume'}_简历.pdf`;
  const template = resume.template || 'classic';
  
  console.log('生成文件名:', filename, '模板:', template);
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`);
  res.setHeader('Cache-Control', 'no-store');
  
  const doc = new PDFDocument({
    margin: 50,
    size: 'A4',
    bufferPages: true
  });
  
  doc.registerFont('Chinese', CHINESE_FONT_PATH);
  doc.font('Chinese');
  
  doc.on('end', () => {
    console.log('PDF生成完成:', new Date().toISOString());
  });
  
  doc.on('error', (err) => {
    console.error('PDF生成错误:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'PDF生成失败' });
    }
  });
  
  doc.pipe(res);
  
  const renderFn = TEMPLATES[template] || TEMPLATES.classic;
  renderFn(doc, resume);
  
  doc.end();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
