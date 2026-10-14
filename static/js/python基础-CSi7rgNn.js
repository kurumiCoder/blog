const n=`# python基础

## 环境

### python
==1==
python安装包

### pip

==介绍==

包管理工具

==命令==

\`\`\`properties
pip install 包:安装
pip uninstall 包:卸载
pip list:显示已安装的包
pip freeze:显示已安装的包，并且以指定格式显示

pip config
\`\`\`

## 注释

\`\`\`python
#
"""

"""
\`\`\`

## 变量

\`\`\`python
temp = 20
print("测试=", temp)
\`\`\`

## 数据类型

![image-20240119213942314](./python%E5%9F%BA%E7%A1%80.assets/image-20240119213942314.png)

### 判断类型

\`\`\`python
print("类型", type(temp))
'''
类型 <class 'int'>
'''
\`\`\`

### 类型转换

\`\`\`python
temp = float(20)
\`\`\`

\`\`\`bash
type:
	- int
	- float
    - complex
    - bool
    - str
\`\`\`

## 运算

<img src="./python%E5%9F%BA%E7%A1%80.assets/image-20240119222313031.png" alt="image-20240119222313031" style="zoom:67%;" />

### printf

\`\`\`python
name = "name=%1.5f" % (1.565656)
\`\`\`

## 输入输出

> 输出

\`\`\`python
print("测试=",temp)//,内容拼接
print("test",end='')不换行
print()空就是换行
\`\`\`

> 输入

\`\`\`python
temp=input("请输入")
temp为str
\`\`\`

## 判断

\`\`\`python
temp=True
temp=False

age =7
if age>=18:
    print(True)
elif age>10:
    print(1)
else:
    print(False)
\`\`\`

## 循环控制

\`\`\`python
import random

temp = random.randint(1, 10)

while temp<10:
    print(temp)
    temp = random.randint(temp,10)

""""""
arr='integer'

for item in arr:
    print(f"{item},",end='')

break
continue
\`\`\`

## 函数

> 基本结构

\`\`\`python
def test(str):
    count = 0
    for item in str:
        count+=1
    return count

arr="yyjfrhfgfg"
print(test(arr))
\`\`\`

<img src="./python%E5%9F%BA%E7%A1%80.assets/image-20240120010536505.png" alt="image-20240120010536505" style="zoom:67%;" />

![image-20240120010902289](./python%E5%9F%BA%E7%A1%80.assets/image-20240120010902289.png)

> 进阶

\`\`\`python
def test():
    return 1,2

x,y=test()
\`\`\`

\`\`\`python
def test(name,age):
    pass

test(name='lpl',age=18)

"""默认参数"""
def test(name,age=18):
    pass
\`\`\`

![image-20240120234908993](./python%E5%9F%BA%E7%A1%80.assets/image-20240120234908993.png)

![image-20240120235005117](./python%E5%9F%BA%E7%A1%80.assets/image-20240120235005117.png)

> lamda

![image-20240120235423256](./python%E5%9F%BA%E7%A1%80.assets/image-20240120235423256.png)

![image-20240120235625662](./python%E5%9F%BA%E7%A1%80.assets/image-20240120235625662.png)

![image-20240120235701596](./python%E5%9F%BA%E7%A1%80.assets/image-20240120235701596.png)

## 集合

### list - 数组

![image-20240120013120053](./python%E5%9F%BA%E7%A1%80.assets/image-20240120013120053.png)

\`\`\`python
"""获取下标"""
list = ["asa","dada","dadawewe"]
list.index("asa")

"""
插入
1 为插入的位置
"""
list.insert(1,"itema")

"""
追加
arr.push()
list.add()
extend 将其他集合内取出并追加
"""
list.append(var)
list.extend(newList)

"""
删除
pop带return
remove删除第一个匹配项
clear清空
"""
list.del(1)
list.pop(1)
list.remove("content")
list.clear()

"""某元素统计"""
list.count(1)

"""
sort
list.sort(cmp=None, key=None, reverse=False)
cmp -- 可选参数, 如果指定了该参数会使用该参数的方法进行排序。
key -- 主要是用来进行比较的元素，只有一个参数，具体的函数的参数就是取自于可迭代对象中，指定可迭代对象中的一个元素来进行排序。
reverse -- 排序规则，reverse = True 降序， reverse = False 升序（默认）
"""
# 获取列表的第二个元素
def takeSecond(elem):
    return elem[1]


# 列表
random = [(2, 2), (3, 4), (4, 1), (1, 3)]

# 指定第二个元素排序
random.sort(key=takeSecond)

# 输出类别
print("排序列表：")
print(random)
排序列表：
[(4, 1), (2, 2), (1, 3), (3, 4)]
\`\`\`

### 元祖(tuple) - const

元祖定义完成，就不可修改

\`\`\`python
temp=(1,2,3,4)
temp=()
temp=tuple()
"""单个会变成str,要加逗号"""
temp=("hello")
temp=("hello",)

temp[1][2]

temp.index('hello')

temp.count(item)

len(temp)

"""其中的[]可变"""
temp=(1,2,3,[21,31])

\`\`\`

### 字符串

> 定义

\`\`\`python
name = 'test'
name = "test"
name = """test"""
\`\`\`

> 拼接

\`\`\`python
name = "name"
name +=',test'
print(name)

"""占位符"""
name = "name=%d" % 1
name = "name=%d,%d" % (1,2)

"""  \`\${}\`  """
temp=10.21
str=f"str={temp}"
\`\`\`

\`字符串不能与其他类型拼接\`

> method

==字符串内部不能改==

\`\`\`python
temp='da and'
print(temp.index('and'))

"""全量替换"""
temp=temp.replace(str1,str2)

"""分隔返回类型为list"""
temp=temp.split(' ')

"""去除前后字符串默认空格和\\n,全量"""

temp="  iteh fsfs "
temp = "12 dada 21"
print(temp.strip('12 '))  #dada
\`\`\`

### 序列

连续有序的集合（列表，元祖，字符串）

\`\`\`python
"""
切片
[起始index:结束index:步长]
结束index可以为空
"""
temp=[1,23,4,4141,41]
print(temp)
temp=temp[0:len(temp):2]
print(temp)
"""
[1, 23, 4, 4141, 41]
[1, 4, 41]
"""

temp='万过薪月，员序程马黑来，nohtyP学'
temp=temp.split('，')
print(temp[1][len(temp[1])-1::-1])
\`\`\`

### set

\`\`\`python
temp={1,12,31,31}
temp=set()

temp.add(item)
temp.remove(item)
"""随机取出一个元素"""
tst=temp.pop()

temp.clear()

"""差集"""
set1={1,2,3}
set2={1,5,6}
set3=set1.difference(set2)

"""
set1={2,3}
set2={1,5,6}
"""
set1.difference_update(set2)

set3=set1.union(set2)
\`\`\`

### 字典 - map

唯一

\`\`\`python
temp={'name':'lpl','age':12}
temp={}
temp=dict()

temp.get('name')
temp.keys()
temp.values()
temp.pop(key)
temp.clear()

temp['name']='zst001'
print(temp.update({'name':'wq'}))

temp={'name':'lpl',False:12}
for item in temp:
    print(item)
    print(temp[item])
\`\`\`

### 通用方法

\`\`\`python
len()
max()
min()

temp={15,12,31,31}
sorted(temp)//return,会转化为list[],不影响原数据
print(temp)
sorted(a,reverse=True)



"""type change"""
list()
str()
tuple()
set()
\`\`\`

## 文件

> open()

\`\`\`python
file = open("./test.txt", "r", encoding="UTF-8")
"""
open(name,mode,encoding='UTF-8')
name: 路径
mode:
    - r : 只读
    - w : 存在则覆盖则,不存在则创建
    - a : 追加
"""


print(f"read={file.read()}")
file.read(读取的长度)
"""
read=dafafhawfkwarkwarhawrfika
fafashifoawoifwaa
fafegwe
fafegwegeerq
gesff
gesffwfew
e
es
eww
ge
"""


print(f"readlines={file.readlines()}")
"""
readlines=['dafafhawfkwarkwarhawrfika\\n', 'fafashifoawoifwaa\\n', 'fafegwe\\n', 'fafegwegeerq\\n', 'gesff\\n', 'gesffwfew\\n', 'e\\n', 'es\\n', 'eww\\n', 'ge']
"""

print(f"readlines={file.readline()}")
"""
readlines=dafafhawfkwarkwarhawrfika
"""

for value in open("./test.txt", "r", encoding="UTF-8"):
    print(value,end='')


file.close()

"自动close"
with open("./test.txt", "r", encoding="UTF-8") as file:
    file.readlines()
\`\`\`

> write

\`\`\`python
with open("./test.txt", "w", encoding="UTF-8") as file:
    file.write('test45454545454545454545454545454545')
    file.flush() //最终写入

with open("./test.txt", "r", encoding="UTF-8") as file:
    print(file.read())
\`\`\`

> append

\`\`\`python
with open("./test.txt", "a", encoding="UTF-8") as file:
    file.write('\\nsaadadas')
    file.flush()

with open("./test.txt", "r", encoding="UTF-8") as file:
    print(file.read())
\`\`\`

## 异常

\`\`\`python
try:
    do
except IndexError as e :
    catch

try:
    do
except exception as e :
    catch

try:

except:

else:

finally:


\`\`\`

## 模块

### 模块的导入

![image-20240121121137959](./python%E5%9F%BA%E7%A1%80.assets/image-20240121121137959.png)

### 自定义模块

\`\`\`python
"""utils.py"""
def test(a,b):
    print(a+b)

"""main.py"""
import utils

utils.test(1,2)

\`\`\`

![image-20240121122431368](./python%E5%9F%BA%E7%A1%80.assets/image-20240121122431368.png)

\`\`\`python
import utils

if __name__ == '__main__':
    utils.test(1,2)
\`\`\`

## 包

<img src="./python%E5%9F%BA%E7%A1%80.assets/image-20240121143518308.png" alt="image-20240121143518308" style="zoom:80%;" />

\`\`\`python
import my_package.utils as utils

if __name__ == '__main__':
    utils.test(1,2)

\`\`\`

<img src="./python%E5%9F%BA%E7%A1%80.assets/image-20240121162424834.png" alt="image-20240121162424834" style="zoom:80%;" />

<img src="./python%E5%9F%BA%E7%A1%80.assets/image-20240121162611622.png" alt="image-20240121162611622" style="zoom:80%;" />

[python项目文件夹中的**init**.py文件有啥作用？\\_哔哩哔哩\\_bilibili](https://www.bilibili.com/video/BV1SG411d73g/?p=1&spm_id_from=pageDriver)

## 面向对象

\`\`\`python
class Student:
    name: None
    age: None

    def __init__(self,name,age):
        self.name = name
        self.age = age

    def toString(self):
        return f"name={self.name},age={self.age}"
\`\`\`

\`\`\`python
from my_package.my_class import Student

temp=Student()
temp.name='lpl'
temp.age=10

print(type(temp))
print(temp.toString())

\`\`\`

### 魔术方法

![image-20240121181719593](./python%E5%9F%BA%E7%A1%80.assets/image-20240121181719593.png)

![image-20240121182418660](./python%E5%9F%BA%E7%A1%80.assets/image-20240121182418660.png)

### 私有成员

<img src="./python%E5%9F%BA%E7%A1%80.assets/image-20240121182724549.png" alt="image-20240121182724549" style="zoom:67%;" />

### 继承

\`\`\`python
class Parent:

class Children(Parent):

class Children(Parent,AwareName):
\`\`\`

![image-20240121184032660](./python%E5%9F%BA%E7%A1%80.assets/image-20240121184032660.png)

![image-20240121190751865](./python%E5%9F%BA%E7%A1%80.assets/image-20240121190751865.png)

### 类型注解

\`\`\`python
temp:int = 10
#type: int
\`\`\`

<img src="./python%E5%9F%BA%E7%A1%80.assets/image-20240121192025787.png" alt="image-20240121192025787" style="zoom:80%;" />

### 多态

<img src="./python%E5%9F%BA%E7%A1%80.assets/image-20240121192422387.png" alt="image-20240121192422387" style="zoom: 80%;" />

## 闭包

![image-20240121211224112](./python%E5%9F%BA%E7%A1%80.assets/image-20240121211224112.png)

![image-20240121211328230](./python%E5%9F%BA%E7%A1%80.assets/image-20240121211328230.png)

![image-20240121211617318](./python%E5%9F%BA%E7%A1%80.assets/image-20240121211617318.png)

![image-20240121212232206](./python%E5%9F%BA%E7%A1%80.assets/image-20240121212232206.png)

## 装饰器

![image-20240121213014890](./python%E5%9F%BA%E7%A1%80.assets/image-20240121213014890.png)

# 标准库

## random

\`\`\`python
import random

age = random.randint(1, 10)
print(age)

arr = [1.42,424.4,414,31]
random.choice(arr)#随机选择
\`\`\`

## range

\`\`\`python
range(5);
[0,1,2,3,4]
range(start,end)
range(start,end,step)
\`\`\`

## time

\`\`\`python
import time
\`\`\`



## json

![image-20240121174317802](./python%E5%9F%BA%E7%A1%80.assets/image-20240121174317802.png)

![image-20240121174505036](./python%E5%9F%BA%E7%A1%80.assets/image-20240121174505036.png)

\`\`\`python
json.dumps(d)
@ python中字典转字符串单引号变双引号
\`\`\`

1. \`loads\`操作的是字符串
2. \`load\`操作的是文件流

## glob

\`glob\` 是 Python 标准库中用于**文件路径模式匹配**的模块，可以根据通配符规则查找符合条件的文件路径。



### 1. 核心函数

| 函数                    | 说明                                         |
| ----------------------- | -------------------------------------------- |
| \`glob.glob(pattern)\`    | 返回所有匹配路径的**列表**                   |
| \`glob.iglob(pattern)\`   | 返回匹配路径的**迭代器**（惰性求值，省内存） |
| \`glob.escape(pathname)\` | 转义特殊字符，用于匹配含通配符字符的文件名   |



### 2. 通配符规则

| 模式     | 含义                      | 示例                                            |
| -------- | ------------------------- | ----------------------------------------------- |
| \`*\`      | 匹配任意数量任意字符      | \`*.py\` 匹配所有 py 文件                         |
| \`?\`      | 匹配单个任意字符          | \`file?.txt\` 匹配 \`file1.txt\`、\`fileA.txt\`       |
| \`[seq]\`  | 匹配 seq 中任意一个字符   | \`file[0-9].txt\` 匹配 \`file0.txt\` 到 \`file9.txt\` |
| \`[!seq]\` | 匹配**不在** seq 中的字符 | \`file[!0-9].txt\` 匹配 \`fileA.txt\`               |



### 3. 代码示例

\`\`\`python
import glob
import os

# 1. 基本匹配：当前目录下所有 .py 文件
py_files = glob.glob("*.py")
print(py_files)  # ['main.py', 'utils.py', ...]

# 2. 递归匹配：子目录中所有 .txt 文件（** 匹配任意层目录）
# 需要 recursive=True
all_txt = glob.glob("**/*.txt", recursive=True)
print(all_txt)  # ['a.txt', 'sub/b.txt', 'sub/sub2/c.txt']

# 3. 绝对路径匹配
abs_paths = glob.glob("/home/user/*.pdf")
print(abs_paths)

# 4. 使用 iglob 处理大量文件（节省内存）
for path in glob.iglob("**/*.log", recursive=True):
    print(path)

# 5. 转义特殊字符（比如文件名里真的有 * 或 ?）
weird_file = glob.escape("data[2024]*?.csv") + "*.csv"
# 先转义，再拼接新的通配符
\`\`\`



### 4. 与 \`pathlib\` 对比

Python 3.5+ 更推荐使用 \`pathlib.Path.glob()\`，功能相同但返回的是 \`Path\` 对象：

\`\`\`python
from pathlib import Path

# 等价写法，但更面向对象
py_files = list(Path(".").glob("*.py"))        # 当前目录
all_py = list(Path(".").rglob("*.py"))         # 递归（相当于 **/*.py）
\`\`\`

| 特性     | \`glob\`                      | \`pathlib\`                     |
| -------- | --------------------------- | ----------------------------- |
| 返回类型 | 字符串列表                  | \`Path\` 对象                   |
| 递归写法 | \`**/*.py\`, \`recursive=True\` | \`.rglob("*.py")\`              |
| 链式操作 | 不支持                      | 支持（如 \`.stem\`, \`.suffix\`） |



### 5. 常见坑

- **Windows 路径分隔符**：\`glob\` 内部会处理，但写模式时统一用 \`/\` 即可跨平台。
- **隐藏文件**：\`.*\` 不会自动匹配，需要显式写 \`glob.glob(".*")\`。
- **空匹配**：找不到文件时返回**空列表** \`[]\`，不会报错。

如果你需要处理更复杂的文件过滤（如正则、文件大小、修改时间），可以配合 \`os.path\` 或 \`pathlib\` 进一步筛选。



## 其他

| 函数       | 说明     |
| ---------- | -------- |
| len（var） | 获取长度 |
|            |          |
|            |          |









# PySpark

\`\`\`python
from pyspark import SparkContext,SparkConf

conf = SparkConf().setMaster("local[*]").setAppName("test")

sc=SparkContext(conf=conf)

print(sc.version)

sc.stop()
\`\`\`

# 爬虫

## 实用方法

\`\`\`python
data = []
keys = None
fw=open("./data.json", "w", encoding="UTF-8")

with open("./data_all.csv", "r", encoding="UTF-8") as file:
    keys = file.readline().strip().split(",")
    fw.write('[')
    for line in file:
        values = line.strip().split(",")
        if len(values) != len(keys):
            continue

        map = dict()
        for index in range(len(keys)):
            map.update({keys[index]: values[index]})

        fw.write(str(map)+',')
    fw.write(']')
    fw.flush()
    fw.close()
\`\`\`

## 编解码

\`\`\`python
from urllib import request, parse


data = {"wd": "大大", "sex": "男"}
parse.urlencode(data)
"""
wd=%E5%A4%A7%E5%A4%A7&sex=%E7%94%B7
"""

parse.quote('大大')

\`\`\`

## XPath

1. 安装xpath浏览器插件

2. \`\`\`bash
   pip install lxml
   \`\`\`

3. \`\`\`python
   from lxml import etree
   
   """解析本地文件"""
   html_tree = etree.parse('xx.html')
   
   """解析服务器相应文件"""
   html_tree = etree.HTML(response.read().decode('utf-8'))
   
   """匹配"""
   html_tree.xpath(xpath路径)
   
   \`\`\`

4. <img src="./python%E5%9F%BA%E7%A1%80.assets/image-20240122212148812.png" alt="image-20240122212148812" style="zoom:67%;" />

## jsonPath

1. \`\`\`python
   pip install jsonpath
   \`\`\`

2. ![image-20240122230528546](./python%E5%9F%BA%E7%A1%80.assets/image-20240122230528546.png)

3. ![image-20240122235312075](./python%E5%9F%BA%E7%A1%80.assets/image-20240122235312075.png)

![image-20240122234751496](./python%E5%9F%BA%E7%A1%80.assets/image-20240122234751496.png)

![image-20240122234756089](./python%E5%9F%BA%E7%A1%80.assets/image-20240122234756089.png)

## bs4

![image-20240123001137661](./python%E5%9F%BA%E7%A1%80.assets/image-20240123001137661.png)

![image-20240123001452704](./python%E5%9F%BA%E7%A1%80.assets/image-20240123001452704.png)

![image-20240123004708904](./python%E5%9F%BA%E7%A1%80.assets/image-20240123004708904.png)

## Selenium

### 介绍

1. web应用程序测试工具
2. 测试直接运行在浏览器中，就像真正的用户在操作一样
3. 支持各种driver（chrmoe，edge）驱动真实浏览器完成测试
4. 支持无界面浏览器
5. 模拟浏览器，自动执行网页中的js代码，实现动态加载

### 安装

https://chromedriver.storage.googleapis.com/index.html

https://googlechromelabs.github.io/chrome-for-testing/

\`\`\`shell
pip install selenium
\`\`\`

### 使用

\`\`\`python
""" selenium """
from selenium import webdriver
from selenium.webdriver.common.by import By


def seleniumTest():
    browser = webdriver.Chrome()

    url = "http://cn.bing.com"
    browser.get(url)
    # 获取元素
    input = browser.find_element(By.XPATH, "//input[@id='sb_form_q']")
    # 设置元素的值
    input.send_keys("bilibili")
    # 点击提交
    input.submit()
    sleep(2)
    # 滑到底部
    js_bottom="document.documentElement.scrollTop=10000"
    browser.execute_script(js_bottom)


    sleep(100)


if __name__ == "__main__":
    seleniumTest()
\`\`\`

![image-20240123190419629](./python%E5%9F%BA%E7%A1%80.assets/image-20240123190419629.png)

[Python selenium 滚动页面以及滚动至元素可见(转载)\\_selenium 元素移到浏览器可视python-CSDN博客](https://blog.csdn.net/xp178171640/article/details/116524022)

### 无界面操作

\`\`\`python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options


def getHandler(flag:bool):
    if flag==False:
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--disable-gpu")
        # chrome_options.binary_location=r'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe'
        browser = webdriver.Chrome(chrome_options)
        return browser
    elif flag==True:
        return webdriver.Chrome()
\`\`\`

## requsets

![image-20240123211411628](./python%E5%9F%BA%E7%A1%80.assets/image-20240123211411628.png)

![image-20240123213500055](./python%E5%9F%BA%E7%A1%80.assets/image-20240123213500055.png)

\`\`\`python
import requests


def requestsTest():
    url = "https://dongmanhuayuan.myheartsite.com/api/acg/search"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
    }
    data = {"keyword": "假面骑士", "page": 1, "searchType": 0, "serverType": "server1"}
    # response=requests.get(url=url,headers=headers)
    response = requests.post(url=url,headers=headers,params=data)
    response.encoding="utf-8"
    # text:str
    content=json.loads(response.text)
    result = jsonpath.jsonpath(content, "$..title")
    for value in result:
        print(value)


if __name__ == "__main__":
    requestsTest()
\`\`\`

> 绕过cookie

![image-20240123215633166](./python%E5%9F%BA%E7%A1%80.assets/image-20240123215633166.png)

![image-20240123215943749](./python%E5%9F%BA%E7%A1%80.assets/image-20240123215943749.png)

> 会话保持

![image-20240123230505517](./python%E5%9F%BA%E7%A1%80.assets/image-20240123230505517.png)

![image-20240123230730909](./python%E5%9F%BA%E7%A1%80.assets/image-20240123230730909.png)

> 破解验证码

http://chaojiying.com

## scrapy

### 介绍

![image-20240123231422047](./python%E5%9F%BA%E7%A1%80.assets/image-20240123231422047.png)

### 项目结构

![image-20240123232542695](./python%E5%9F%BA%E7%A1%80.assets/image-20240123232542695.png)

![image-20240123233458567](./python%E5%9F%BA%E7%A1%80.assets/image-20240123233458567.png)

![image-20240123233847350](./python%E5%9F%BA%E7%A1%80.assets/image-20240123233847350.png)

\`\`\`python
# Obey robots.txt rules
ROBOTSTXT_OBEY = False
\`\`\`

![image-20240123235335638](./python%E5%9F%BA%E7%A1%80.assets/image-20240123235335638.png)

### 使用

![image-20240124000725524](./python%E5%9F%BA%E7%A1%80.assets/image-20240124000725524.png)

> ipython

\`\`\`shell
pip install ipython

scrapy shell www.baidu.com
\`\`\`

# 其他

## 虚拟环境

![image-20240123151956623](./python%E5%9F%BA%E7%A1%80.assets/image-20240123151956623.png)

## requirements.txt

\`\`\`python
pip install pipreqs

pipreqs ./ --encoding=utf8

pip freeze > requirements.txt
\`\`\`

## 镜像源

- --index-url https://mirrors.nju.edu.cn/pytorch/whl/cu126



## miniConda

[(34 封私信 / 82 条消息) 将Anaconda3环境迁移到Miniforge3方法 - 知乎](https://zhuanlan.zhihu.com/p/1926670803652571369)



## uv

### install

\`\`\`bash
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

$env:Path = "C:\\Users\\lpl\\.local\\bin;$env:Path"
\`\`\`

### 常用命令

\`\`\`sql

日常开发中可以使用 \`uv run\` 直接运行脚本，无需手动激活虚拟环境。# 版本管理
uv python list             # 查看可用的 Python 版本
uv python install 3.12     # 安装最新的 Python 3.12
uv python default 3.12     # 设置全局默认 Python 版本
uv python pin 3.12         # 为当前项目固定 Python 版本


# 管理虚拟环境
uv venv                    # 创建环境
uv venv my-env -p 3.11     # 指定环境名字和python版本
uv venv -p python@3.11     # 使用 python3.11 创建 .venv
source .venv/bin/activate  # 激活环境（此步仍然需要）
uv init                    # 初始化uv项目
uv pip install             # 装包
uv add                     # 为项目加包
uv sync                    # 如果有拉取一个uv的项目，直接sync即可配置好环境
uv pip freeze > requirements.txt  # 生成一个包含所有已安装包及其精确版

日常开发中可以使用 \`uv run\` 直接运行脚本，无需手动激活虚拟环境。
\`\`\`

### 项目管理

uv 支持以 \`pyproject.toml\` 为中心的现代项目管理方式，这是比 pip 模式更推荐的使用方法，尤其适合团队协作和多环境部署。

#### 初始化项目

\`\`\`bash
uv init my_project
cd my_project
\`\`\`

这会创建以下基本项目结构：

\`\`\`bash
my_project/
├── pyproject.toml    # 项目配置和依赖声明
├── .python-version   # 固定 Python 版本
├── README.md
└── main.py
\`\`\`

#### 添加和移除依赖

在项目模式下，推荐使用 \`uv add\` 和 \`uv remove\` 管理依赖，它们会自动更新 \`pyproject.toml\` 和 \`uv.lock\`：

\`\`\`
# 添加生产依赖
uv add requests

# 添加指定版本的依赖
uv add "requests>=2.31.0"

# 添加开发依赖（只在开发环境使用，如测试框架）
uv add --dev pytest ruff

# 移除依赖
uv remove requests
\`\`\`

#### 安装项目全部依赖（uv sync）

克隆项目或更新 \`pyproject.toml\` 后，运行以下命令一键安装所有依赖：

\`\`\`
uv sync
\`\`\`

> **uv sync 说明：**类似于 \`pip install -r requirements.txt\`，它会根据 \`pyproject.toml\` 和 \`uv.lock\` 安装所有依赖，确保环境与其他开发者完全一致。如果安装速度慢，可以在 \`pyproject.toml\` 中设置国内镜像源：
>
> \`\`\`
> [tool.uv]
> index-url = "https://pypi.tuna.tsinghua.edu.cn/simple"
> \`\`\`

#### 生成/更新锁文件

\`\`\`
uv lock
\`\`\`

该命令会解析 \`pyproject.toml\` 中的依赖并生成（或更新）\`uv.lock\` 文件。\`uv.lock\` 应该提交到版本库，确保团队所有成员使用完全相同的依赖版本。
`;export{n as default};
