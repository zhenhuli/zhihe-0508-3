const recipes = [
  {
    id: 1,
    name: "红烧肉",
    category: "chinese",
    categoryName: "中餐",
    image: "https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?w=600",
    description: "经典中式红烧肉，肥而不腻，入口即化",
    prepTime: "30分钟",
    cookTime: "90分钟",
    servings: 4,
    ingredients: [
      { name: "五花肉", amount: "500g" },
      { name: "生抽", amount: "3勺" },
      { name: "老抽", amount: "1勺" },
      { name: "冰糖", amount: "30g" },
      { name: "料酒", amount: "2勺" },
      { name: "姜片", amount: "5片" },
      { name: "八角", amount: "2个" },
      { name: "桂皮", amount: "1小块" }
    ],
    steps: [
      { text: "五花肉切成3厘米见方的块，冷水下锅焯水，撇去浮沫后捞出沥干", image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400" },
      { text: "锅中放少许油，加入冰糖小火炒出糖色", image: "https://images.unsplash.com/photo-1570000363929-0013b5c47f28?w=400" },
      { text: "放入五花肉翻炒均匀，使其表面裹上糖色", image: "https://images.unsplash.com/photo-1606755962773-d324f6e88134?w=400" },
      { text: "加入姜片、八角、桂皮炒香，倒入料酒、生抽、老抽", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400" },
      { text: "加入没过肉的热水，大火烧开后转小火慢炖1小时", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400" },
      { text: "汤汁浓稠时转大火收汁，即可出锅", image: "https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?w=400" }
    ]
  },
  {
    id: 2,
    name: "麻婆豆腐",
    category: "chinese",
    categoryName: "中餐",
    image: "https://images.unsplash.com/photo-1582576163890-eb75df2feb09?w=600",
    description: "四川名菜，麻辣鲜香，豆腐嫩滑",
    prepTime: "15分钟",
    cookTime: "20分钟",
    servings: 3,
    ingredients: [
      { name: "嫩豆腐", amount: "1块" },
      { name: "牛肉末", amount: "100g" },
      { name: "豆瓣酱", amount: "2勺" },
      { name: "花椒粉", amount: "1勺" },
      { name: "蒜末", amount: "适量" },
      { name: "葱花", amount: "适量" },
      { name: "水淀粉", amount: "适量" }
    ],
    steps: [
      { text: "豆腐切成2厘米见方的块，用淡盐水浸泡10分钟", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400" },
      { text: "锅中热油，放入牛肉末炒散炒香", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400" },
      { text: "加入豆瓣酱、蒜末炒出红油", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400" },
      { text: "加入适量清水烧开，放入豆腐块轻轻推动", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400" },
      { text: "小火煮5分钟，加入水淀粉勾芡", image: "https://images.unsplash.com/photo-1582576163890-eb75df2feb09?w=400" },
      { text: "出锅前撒上花椒粉和葱花即可", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400" }
    ]
  },
  {
    id: 3,
    name: "意大利肉酱面",
    category: "western",
    categoryName: "西餐",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600",
    description: "经典意式肉酱面，浓郁香醇",
    prepTime: "20分钟",
    cookTime: "45分钟",
    servings: 4,
    ingredients: [
      { name: "意大利面", amount: "400g" },
      { name: "牛肉末", amount: "300g" },
      { name: "番茄", amount: "3个" },
      { name: "洋葱", amount: "1个" },
      { name: "胡萝卜", amount: "1根" },
      { name: "西芹", amount: "2根" },
      { name: "红酒", amount: "100ml" },
      { name: "罗勒叶", amount: "适量" }
    ],
    steps: [
      { text: "洋葱、胡萝卜、西芹切成小丁，番茄去皮切丁", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400" },
      { text: "锅中热油，放入蔬菜丁炒软", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400" },
      { text: "加入牛肉末炒散，炒至变色", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400" },
      { text: "倒入红酒煮至酒精挥发，加入番茄丁", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400" },
      { text: "小火慢炖30分钟，加盐和黑胡椒调味", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400" },
      { text: "煮好意面，拌入肉酱，撒上罗勒叶即可", image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400" }
    ]
  },
  {
    id: 4,
    name: "凯撒沙拉",
    category: "western",
    categoryName: "西餐",
    image: "https://images.unsplash.com/photo-1550304943-4f24f54dd72f?w=600",
    description: "清爽健康的经典沙拉",
    prepTime: "20分钟",
    cookTime: "10分钟",
    servings: 2,
    ingredients: [
      { name: "罗马生菜", amount: "1颗" },
      { name: "鸡胸肉", amount: "200g" },
      { name: "面包丁", amount: "50g" },
      { name: "帕玛森芝士", amount: "30g" },
      { name: "蛋黄酱", amount: "3勺" },
      { name: "柠檬汁", amount: "1勺" },
      { name: "大蒜", amount: "2瓣" }
    ],
    steps: [
      { text: "鸡胸肉用盐和黑胡椒腌制，煎熟后切片", image: "https://images.unsplash.com/photo-1604503468506-a8da13d82781?w=400" },
      { text: "面包丁用烤箱烤至金黄酥脆", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400" },
      { text: "生菜洗净撕成小块，放入大碗", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400" },
      { text: "蛋黄酱加入柠檬汁、蒜末、盐调成酱汁", image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400" },
      { text: "将酱汁倒入生菜中拌匀", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400" },
      { text: "放上鸡肉片、面包丁，撒上芝士碎即可", image: "https://images.unsplash.com/photo-1550304943-4f24f54dd72f?w=400" }
    ]
  },
  {
    id: 5,
    name: "日式照烧鸡腿",
    category: "japanese",
    categoryName: "日料",
    image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600",
    description: "甜咸适口的日式经典料理",
    prepTime: "30分钟",
    cookTime: "25分钟",
    servings: 2,
    ingredients: [
      { name: "鸡腿", amount: "2个" },
      { name: "酱油", amount: "3勺" },
      { name: "味醂", amount: "2勺" },
      { name: "清酒", amount: "2勺" },
      { name: "白糖", amount: "1勺" },
      { name: "姜末", amount: "适量" },
      { name: "白芝麻", amount: "适量" }
    ],
    steps: [
      { text: "鸡腿去骨，用叉子在肉面戳几下便于入味", image: "https://images.unsplash.com/photo-1604503468506-a8da13d82781?w=400" },
      { text: "酱油、味醂、清酒、白糖调成照烧汁", image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400" },
      { text: "锅中不放油，鸡皮朝下煎至金黄出油", image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400" },
      { text: "翻面继续煎至鸡肉熟透", image: "https://images.unsplash.com/photo-1606755962773-d324f6e88134?w=400" },
      { text: "倒入照烧汁和姜末，小火收汁", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400" },
      { text: "切片装盘，撒上白芝麻即可", image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400" }
    ]
  },
  {
    id: 6,
    name: "寿司卷",
    category: "japanese",
    categoryName: "日料",
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600",
    description: "清新美味的日式寿司",
    prepTime: "40分钟",
    cookTime: "20分钟",
    servings: 4,
    ingredients: [
      { name: "寿司米", amount: "300g" },
      { name: "海苔", amount: "4张" },
      { name: "黄瓜", amount: "1根" },
      { name: "胡萝卜", amount: "1根" },
      { name: "牛油果", amount: "1个" },
      { name: "寿司醋", amount: "3勺" },
      { name: "三文鱼", amount: "200g" }
    ],
    steps: [
      { text: "寿司米洗净煮熟，趁热拌入寿司醋拌匀放凉", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400" },
      { text: "黄瓜、胡萝卜切条，牛油果切片", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400" },
      { text: "海苔铺在寿司帘上，均匀铺上米饭", image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400" },
      { text: "放上黄瓜、胡萝卜、牛油果和三文鱼", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400" },
      { text: "用寿司帘紧紧卷起，切成小段", image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400" },
      { text: "配上芥末和酱油即可享用", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400" }
    ]
  },
  {
    id: 7,
    name: "泰式冬阴功汤",
    category: "thai",
    categoryName: "泰餐",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600",
    description: "酸辣鲜香的泰国国汤",
    prepTime: "20分钟",
    cookTime: "30分钟",
    servings: 3,
    ingredients: [
      { name: "虾", amount: "200g" },
      { name: "蘑菇", amount: "100g" },
      { name: "冬阴功酱", amount: "2勺" },
      { name: "椰浆", amount: "200ml" },
      { name: "青柠", amount: "1个" },
      { name: "香茅", amount: "2根" },
      { name: "小米辣", amount: "3个" },
      { name: "香菜", amount: "适量" }
    ],
    steps: [
      { text: "虾去壳留尾，蘑菇切片，香茅切段", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400" },
      { text: "锅中烧开水，放入香茅、小米辣煮出香味", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400" },
      { text: "加入冬阴功酱搅拌均匀", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400" },
      { text: "放入蘑菇煮5分钟，加入虾煮至变色", image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400" },
      { text: "倒入椰浆，挤入青柠汁调味", image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400" },
      { text: "出锅前撒上香菜即可", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400" }
    ]
  },
  {
    id: 8,
    name: "泰式青咖喱鸡",
    category: "thai",
    categoryName: "泰餐",
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600",
    description: "浓郁椰香的泰式咖喱",
    prepTime: "25分钟",
    cookTime: "35分钟",
    servings: 4,
    ingredients: [
      { name: "鸡腿肉", amount: "400g" },
      { name: "青咖喱酱", amount: "3勺" },
      { name: "椰浆", amount: "400ml" },
      { name: "茄子", amount: "2个" },
      { name: "青椒", amount: "1个" },
      { name: "罗勒叶", amount: "适量" },
      { name: "鱼露", amount: "1勺" },
      { name: "棕榈糖", amount: "1勺" }
    ],
    steps: [
      { text: "鸡腿肉切块，茄子切滚刀块，青椒切块", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400" },
      { text: "锅中倒入少许椰浆，炒香青咖喱酱", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400" },
      { text: "放入鸡肉块炒至变色", image: "https://images.unsplash.com/photo-1606755962773-d324f6e88134?w=400" },
      { text: "倒入剩余椰浆，大火烧开", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400" },
      { text: "加入茄子煮软，再加入青椒", image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400" },
      { text: "用鱼露和棕榈糖调味，撒上罗勒叶即可", image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400" }
    ]
  }
];

const categories = [
  { id: 'all', name: '全部菜谱', icon: '🍽️' },
  { id: 'chinese', name: '中餐', icon: '🥢' },
  { id: 'western', name: '西餐', icon: '🍝' },
  { id: 'japanese', name: '日料', icon: '🍣' },
  { id: 'thai', name: '泰餐', icon: '🍛' }
];
