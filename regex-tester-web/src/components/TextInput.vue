<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-800">测试文本</h2>
      <button
        @click="clearText"
        class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        清空
      </button>
    </div>

    <textarea
      v-model="text"
      @input="handleInput"
      placeholder="输入要测试的文本..."
      class="w-full h-48 p-4 bg-gray-50 border border-gray-200 rounded-lg resize-none outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm text-gray-800"
    ></textarea>

    <div class="mt-3 flex items-center justify-between text-xs text-gray-500">
      <span>字符数：{{ text.length }}</span>
      <span>行数：{{ lineCount }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['update'])

const defaultText = `=== 邮箱地址 ===
标准格式: test@example.com, hello@world.org
带点号: user.name@domain.co.uk
带下划线: user_name@test-site.cn
带加号: user+tag@example.org
公司邮箱: support@company.cn, admin@tech-company.com

=== 手机号码 ===
移动号段: 13812345678, 13987654321
联通号段: 13012345678, 13187654321
电信号段: 18912345678, 17787654321
新号段: 19812345678, 19987654321, 16612345678

=== 网址链接 ===
标准HTTPS: https://www.example.com/path/page?query=1&name=test
标准HTTP: http://test.example.org
带端口号: http://localhost:3000/api/users
带路径参数: https://api.example.com/v1/users/123/posts/456
带锚点: https://example.com/docs#section-title
FTP协议: ftp://files.example.com/release/
简短域名: https://bit.ly/abc123
多级子域名: https://sub.sub2.domain.com/path
中文域名: https://测试.中国/path

=== IP地址 ===
IPv4标准: 192.168.1.1, 10.0.0.255, 172.16.0.100
边界值: 0.0.0.0, 255.255.255.255
内网IP: 192.168.1.100, 10.10.10.10, 172.31.255.254
IPv6: 2001:0db8:85a3:0000:0000:8a2e:0370:7334, ::1, fe80::1

=== 身份证号 ===
18位新格式: 110101199003077758, 310101198508152345
18位带X: 11010119900307775X, 44010119921225678X
15位老格式: 110101900307775, 310101850815234, 440101921225678

=== 日期格式 ===
年-月-日: 2024-01-15, 2023-12-25, 2024-02-29
年/月/日: 2023/12/25, 2024/01/15
年.月.日: 2023.12.25, 2024.01.15
中文日期: 2024年1月15日, 二〇二四年一月十五日
短日期: 2024-1-5, 2024/1/5, 24/1/5

=== 中文字符 ===
简单中文: 你好世界，这是一段测试文本
带标点: 你好！今天天气不错。
混合内容: 订单号12345，姓名张三，联系方式13812345678
繁体中文: 這是繁體中文測試

=== HTML标签 ===
单行标签: <div class="test">内容</div>, <span>文字</span>
自闭合标签: <img src="test.jpg" />, <input type="text">
嵌套标签: <div><p>段落</p><br/></div>
属性标签: <a href="https://example.com" target="_blank">链接</a>

=== 其他常用格式 ===
固定电话: 010-12345678, 021-87654321, 0755-12345678
带区号手机: +86 13812345678, (010)12345678
邮政编码: 100000, 200000, 518000
车牌号: 京A12345, 粤B88888, 沪C·D1234
QQ号码: 12345, 123456, 123456789`

const text = ref(defaultText)

const lineCount = computed(() => {
  return text.value ? text.value.split('\n').length : 0
})

const handleInput = () => {
  emit('update', text.value)
}

const clearText = () => {
  text.value = ''
  emit('update', '')
}

emit('update', text.value)
</script>
