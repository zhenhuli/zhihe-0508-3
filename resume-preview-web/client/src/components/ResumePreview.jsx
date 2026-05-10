function ClassicTemplate({ resume }) {
  const { personalInfo = {}, education = [], workExperience = [], skills = [] } = resume;
  
  return (
    <div className="resume-paper p-6 md:p-8 text-sm md:text-base">
      {personalInfo.name && (
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-800 mb-2">{personalInfo.name}</h1>
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 text-xs md:text-sm text-gray-600">
            {personalInfo.email && <span>邮箱: {personalInfo.email}</span>}
            {personalInfo.phone && <span>电话: {personalInfo.phone}</span>}
            {personalInfo.address && <span>地址: {personalInfo.address}</span>}
          </div>
          {personalInfo.summary && (
            <p className="mt-3 text-gray-700 text-xs md:text-sm leading-relaxed">{personalInfo.summary}</p>
          )}
        </div>
      )}
      
      {education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-base md:text-lg font-semibold text-blue-800 border-b border-blue-200 pb-1 mb-3">教育经历</h2>
          <div className="space-y-3">
            {education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-start flex-wrap">
                  <span className="font-medium text-gray-800">{edu.school}</span>
                  {(edu.degree || edu.major) && (
                    <span className="text-xs md:text-sm text-gray-500">{[edu.degree, edu.major].filter(Boolean).join(' - ')}</span>
                  )}
                </div>
                {(edu.startDate || edu.endDate) && (
                  <p className="text-xs md:text-sm text-gray-500">{edu.startDate || ''} - {edu.endDate || '至今'}</p>
                )}
                {edu.description && <p className="text-xs md:text-sm text-gray-600 mt-1">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
      
      {workExperience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-base md:text-lg font-semibold text-blue-800 border-b border-blue-200 pb-1 mb-3">工作经历</h2>
          <div className="space-y-3">
            {workExperience.map((work, index) => (
              <div key={index}>
                <div className="flex justify-between items-start flex-wrap">
                  <span className="font-medium text-gray-800">{work.company}</span>
                  {work.position && <span className="text-xs md:text-sm text-gray-500">{work.position}</span>}
                </div>
                {(work.startDate || work.endDate) && (
                  <p className="text-xs md:text-sm text-gray-500">{work.startDate || ''} - {work.endDate || '至今'}</p>
                )}
                {work.description && <p className="text-xs md:text-sm text-gray-600 mt-1 whitespace-pre-wrap">{work.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
      
      {skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-base md:text-lg font-semibold text-blue-800 border-b border-blue-200 pb-1 mb-3">技能特长</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span key={index} className="text-xs md:text-sm text-gray-700">{skill}</span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ModernTemplate({ resume }) {
  const { personalInfo = {}, education = [], workExperience = [], skills = [] } = resume;
  
  return (
    <div className="resume-paper text-sm md:text-base overflow-hidden">
      <div className="flex h-full">
        <div className="w-1/3 bg-gray-800 text-white p-4 md:p-5">
          <h1 className="text-lg md:text-xl font-bold mb-4">{personalInfo.name || '姓名'}</h1>
          
          <div className="space-y-4 text-xs md:text-sm">
            {personalInfo.email && (
              <div>
                <div className="text-xs text-gray-400">邮箱</div>
                <div className="text-xs md:text-sm text-gray-200 break-all">{personalInfo.email}</div>
              </div>
            )}
            {personalInfo.phone && (
              <div>
                <div className="text-xs text-gray-400">电话</div>
                <div className="text-xs md:text-sm text-gray-200">{personalInfo.phone}</div>
              </div>
            )}
            {personalInfo.address && (
              <div>
                <div className="text-xs text-gray-400">所在地</div>
                <div className="text-xs md:text-sm text-gray-200">{personalInfo.address}</div>
              </div>
            )}
            
            {skills.length > 0 && (
              <div className="mt-6">
                <div className="text-xs text-gray-400 mb-2">技能特长</div>
                <div className="space-y-1">
                  {skills.map((skill, index) => (
                    <div key={index} className="text-xs md:text-sm text-gray-200">• {skill}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="w-2/3 p-4 md:p-5">
          {personalInfo.summary && (
            <div className="mb-4">
              <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-1">个人简介</h3>
              <div className="h-0.5 w-16 bg-blue-500 mb-2"></div>
              <p className="text-xs md:text-sm text-gray-600">{personalInfo.summary}</p>
            </div>
          )}
          
          {workExperience.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-1">工作经历</h3>
              <div className="h-0.5 w-16 bg-blue-500 mb-2"></div>
              <div className="space-y-3">
                {workExperience.map((work, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-800 text-xs md:text-sm">{work.company}</div>
                        {work.position && <div className="text-xs text-blue-600">{work.position}</div>}
                      </div>
                      {(work.startDate || work.endDate) && (
                        <div className="text-xs text-gray-500">{work.startDate || ''} - {work.endDate || '至今'}</div>
                      )}
                    </div>
                    {work.description && <p className="text-xs text-gray-600 mt-1 whitespace-pre-wrap">{work.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {education.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-1">教育经历</h3>
              <div className="h-0.5 w-16 bg-blue-500 mb-2"></div>
              <div className="space-y-3">
                {education.map((edu, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-800 text-xs md:text-sm">{edu.school}</div>
                        {(edu.degree || edu.major) && <div className="text-xs text-blue-600">{[edu.degree, edu.major].filter(Boolean).join(' - ')}</div>}
                      </div>
                      {(edu.startDate || edu.endDate) && (
                        <div className="text-xs text-gray-500">{edu.startDate || ''} - {edu.endDate || '至今'}</div>
                      )}
                    </div>
                    {edu.description && <p className="text-xs text-gray-600 mt-1">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ElegantTemplate({ resume }) {
  const { personalInfo = {}, education = [], workExperience = [], skills = [] } = resume;
  
  return (
    <div className="resume-paper p-6 md:p-8 text-sm md:text-base">
      <div className="h-1 bg-amber-600 mb-6"></div>
      
      {personalInfo.name && (
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">{personalInfo.name}</h1>
          <p className="text-amber-600 text-xs md:text-sm tracking-widest mb-4">RESUME</p>
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.address && <span>{personalInfo.address}</span>}
          </div>
          {personalInfo.summary && (
            <p className="mt-4 text-gray-600 text-xs md:text-sm leading-relaxed text-center">{personalInfo.summary}</p>
          )}
        </div>
      )}
      
      {workExperience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-base md:text-lg font-semibold text-amber-600 mb-1">WORK EXPERIENCE  工作经历</h2>
          <div className="border-t border-gray-300 mb-3"></div>
          <div className="space-y-3">
            {workExperience.map((work, index) => (
              <div key={index}>
                <div className="font-medium text-gray-800 text-sm md:text-base">{work.company}</div>
                {work.position && <div className="text-xs md:text-sm text-amber-600">{work.position}</div>}
                {(work.startDate || work.endDate) && (
                  <div className="text-xs text-gray-500">{work.startDate || ''} - {work.endDate || '至今'}</div>
                )}
                {work.description && <p className="text-xs md:text-sm text-gray-600 mt-1 whitespace-pre-wrap">{work.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
      
      {education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-base md:text-lg font-semibold text-amber-600 mb-1">EDUCATION  教育经历</h2>
          <div className="border-t border-gray-300 mb-3"></div>
          <div className="space-y-3">
            {education.map((edu, index) => (
              <div key={index}>
                <div className="font-medium text-gray-800 text-sm md:text-base">{edu.school}</div>
                {(edu.degree || edu.major) && <div className="text-xs md:text-sm text-amber-600">{[edu.degree, edu.major].filter(Boolean).join(' - ')}</div>}
                {(edu.startDate || edu.endDate) && (
                  <div className="text-xs text-gray-500">{edu.startDate || ''} - {edu.endDate || '至今'}</div>
                )}
                {edu.description && <p className="text-xs md:text-sm text-gray-600 mt-1">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
      
      {skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-base md:text-lg font-semibold text-amber-600 mb-1">SKILLS  技能特长</h2>
          <div className="border-t border-gray-300 mb-3"></div>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {skills.map((skill, index) => (
              <span key={index} className="text-xs md:text-sm text-gray-600">{skill}</span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function CreativeTemplate({ resume }) {
  const { personalInfo = {}, education = [], workExperience = [], skills = [] } = resume;
  
  return (
    <div className="resume-paper text-sm md:text-base overflow-hidden">
      <div className="bg-indigo-500 text-white p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:justify-between">
          <div className="mb-3 md:mb-0">
            <h1 className="text-xl md:text-2xl font-bold">{personalInfo.name || '姓名'}</h1>
            {personalInfo.summary && (
              <p className="text-indigo-200 text-xs md:text-sm mt-1">{personalInfo.summary}</p>
            )}
          </div>
          <div className="text-indigo-200 text-xs md:text-sm space-y-1">
            {personalInfo.email && <div>{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.address && <div>{personalInfo.address}</div>}
          </div>
        </div>
      </div>
      
      <div className="p-5 md:p-6">
        {workExperience.length > 0 && (
          <section className="mb-4">
            <h3 className="text-sm md:text-base font-semibold text-indigo-500 mb-1">◆ 工作经历</h3>
            <div className="h-px bg-indigo-100 mb-3"></div>
            <div className="space-y-3">
              {workExperience.map((work, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start flex-wrap">
                    <span className="font-medium text-gray-800 text-xs md:text-sm">{work.company}</span>
                    {work.position && <span className="text-xs md:text-sm text-indigo-500">{work.position}</span>}
                  </div>
                  {(work.startDate || work.endDate) && (
                    <div className="text-xs text-gray-500">{work.startDate || ''} - {work.endDate || '至今'}</div>
                  )}
                  {work.description && <p className="text-xs md:text-sm text-gray-600 mt-1 whitespace-pre-wrap">{work.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
        
        {education.length > 0 && (
          <section className="mb-4">
            <h3 className="text-sm md:text-base font-semibold text-indigo-500 mb-1">◇ 教育经历</h3>
            <div className="h-px bg-indigo-100 mb-3"></div>
            <div className="space-y-3">
              {education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start flex-wrap">
                    <span className="font-medium text-gray-800 text-xs md:text-sm">{edu.school}</span>
                    {(edu.degree || edu.major) && (
                      <span className="text-xs md:text-sm text-indigo-500">{[edu.degree, edu.major].filter(Boolean).join(' - ')}</span>
                    )}
                  </div>
                  {(edu.startDate || edu.endDate) && (
                    <div className="text-xs text-gray-500">{edu.startDate || ''} - {edu.endDate || '至今'}</div>
                  )}
                  {edu.description && <p className="text-xs md:text-sm text-gray-600 mt-1">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
        
        {skills.length > 0 && (
          <section className="mb-4">
            <h3 className="text-sm md:text-base font-semibold text-indigo-500 mb-1">★ 技能特长</h3>
            <div className="h-px bg-indigo-100 mb-3"></div>
            <div className="grid grid-cols-3 gap-2">
              {skills.map((skill, index) => (
                <div key={index} className="text-xs md:text-sm text-indigo-500">● {skill}</div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

const TEMPLATES = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  elegant: ElegantTemplate,
  creative: CreativeTemplate
};

export default function ResumePreview({ resume, template = 'classic' }) {
  const TemplateComponent = TEMPLATES[template] || TEMPLATES.classic;
  return <TemplateComponent resume={resume} />;
}
