const n=`# java

## 泛型

> 基本使用

引用类型 or 包装类型

\`\`\`java
public class Printer <T>{
    
    T tingToPrint;
    
    public Printer(T tingToPrint){
        this.tingToPrint=tingToPrint;
    }
    
    public void print(){
        System.out.println(thingToPrint);
    }
    
}
\`\`\`

\`\`\`java
public class Main{
    
    public static void main(String[] args){
        
        Printer<String> printer = new Printer<>("23");
        printer.print();
        
    }
    
}
\`\`\`

> 类型安全

\`\`\`java
ArrayList<Object> cats = new ArrayList<>();
//Cat 自动类型转换
cats.add(new Cat());
cats.add(new Dog());

//向低级转换，需自行设置
Cat myCat = (Cat) cats.get(0);
//类型转换异常
Cat myCat = (Cat) cats.get(1);
\`\`\`

> extends

\`\`\`java
public class Printer <T extends Animal>{

}
\`\`\`

> 方法泛型

\`\`\`java
public static <T> void show(T obj){
    System.out.println(obj)
}

show("test");
show(1)
\`\`\`

\`\`\`java
public static <T,V> show(T obj){
    System.out.println(obj);
    return obj
}
\`\`\`

## 异常

### try-with-resources

\`\`\`java
try (
    BufferedInputStream bin = new BufferedInputStream(
        new FileInputStream(new File("test.txt"))
    );
    BufferedOutputStream bout = new BufferedOutputStream(
        new FileOutputStream(new File("out.txt"))
    )
) {
    int b;
    while ((b = bin.read()) != -1) {
        bout.write(b);
    }
}
catch (IOException e) {
    e.printStackTrace();
}

\`\`\`

## 反射

### 获取 Class 对象的四种方式

\`\`\`java
Class alunbarClass = TargetObject.class;

Class alunbarClass1 = Class.forName("cn.javaguide.TargetObject");

TargetObject o = new TargetObject();
Class alunbarClass2 = o.getClass();

ClassLoader.getSystemClassLoader().loadClass("cn.javaguide.TargetObject");
\`\`\`

### 反射的一些基本操作

\`\`\`java
package cn.javaguide;

public class TargetObject {
    private String value;

    public TargetObject() {
        value = "JavaGuide";
    }

    public void publicMethod(String s) {
        System.out.println("I love " + s);
    }

    private void privateMethod() {
        System.out.println("value is " + value);
    }
}
\`\`\`

\`\`\`java
package cn.javaguide;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public class Main {
    public static void main(String[] args) throws ClassNotFoundException, NoSuchMethodException, IllegalAccessException, InstantiationException, InvocationTargetException, NoSuchFieldException {
        /**
         * 获取 TargetObject 类的 Class 对象并且创建 TargetObject 类实例
         */
        Class<?> targetClass = Class.forName("cn.javaguide.TargetObject");
        TargetObject targetObject = (TargetObject) targetClass.newInstance();
        /**
         * 获取 TargetObject 类中定义的所有方法
         */
        Method[] methods = targetClass.getDeclaredMethods();
        for (Method method : methods) {
            System.out.println(method.getName());
        }

        /**
         * 获取指定方法并调用
         */
        Method publicMethod = targetClass.getDeclaredMethod("publicMethod",
                String.class);

        publicMethod.invoke(targetObject, "JavaGuide");

        /**
         * 获取指定参数并对参数进行修改
         */
        Field field = targetClass.getDeclaredField("value");
        //为了对类中的参数进行修改我们取消安全检查
        field.setAccessible(true);
        field.set(targetObject, "JavaGuide");

        /**
         * 调用 private 方法
         */
        Method privateMethod = targetClass.getDeclaredMethod("privateMethod");
        //为了调用private方法我们取消安全检查
        privateMethod.setAccessible(true);
        privateMethod.invoke(targetObject);
    }
}


\`\`\`



## 代理

### JDK动态代理

在 Java 动态代理机制中 \`InvocationHandler\` 接口和 \`Proxy\` 类是核心

\`Proxy\` 类中使用频率最高的方法是：\`newProxyInstance()\` ，这个方法主要用来生成一个代理对象。

\`\`\`java
public static Object newProxyInstance(
    ClassLoader loader,//类加载器
    Class<?>[] interfaces,//
    InvocationHandler h)
    throws IllegalArgumentException
{
    ......
}
\`\`\`

要实现动态代理的话，还必须需要实现\`InvocationHandler\` 的==invoke（）==来自定义处理逻辑。

---

执行步骤：

\`\`\`java
//1 定义接口
public interface SmsService {
    String send(String message);
}
//2 实现接口
public class SmsServiceImpl implements SmsService {
    public String send(String message) {
        System.out.println("send message:" + message);
        return message;
    }
}
//3 定义一个 JDK 动态代理类
public class DebugInvocationHandler implements InvocationHandler {
    
    //代理类中的真实对象
    private final Object target;

    public DebugInvocationHandler(Object target) {
        this.target = target;
    }


    public Object invoke(Object proxy, Method method, Object[] args) throws Exception {
        //调用方法之前，我们可以添加自己的操作
        System.out.println("before method " + method.getName());
        Object result = method.invoke(target, args);
        //调用方法之后，我们同样可以添加自己的操作
        System.out.println("after method " + method.getName());
        return result;
    }
}

//4 获取代理对象的工厂类
public class JdkProxyFactory {
    public static Object getProxy(Object target) {
        return Proxy.newProxyInstance(
                target.getClass().getClassLoader(),
                target.getClass().getInterfaces(), 
                new DebugInvocationHandler(target)
        );
    }
}
\`\`\`

\`\`\`java
//实际使用
SmsService smsService = (SmsService) 
    JdkProxyFactory
    .getProxy(new SmsServiceImpl());

smsService.send("java");
\`\`\`

---

[Java 代理模式详解 | JavaGuide(Java面试 + 学习指南)](https://javaguide.cn/java/basis/proxy.html#_4-静态代理和动态代理的对比)

---

## 集合

### 工具类

> Collections

排序

\`\`\`java
void reverse(List list)//反转
void shuffle(List list)//随机排序
void sort(List list)//按自然排序的升序排序
void sort(List list, Comparator c)//定制排序，由Comparator控制排序逻辑
void swap(List list, int i , int j)//交换两个索引位置的元素
void rotate(List list, int distance)//旋转。当distance为正数时，将list后distance个元素整体移到前面。当distance为负数时，将 list的前distance个元素整体移到后面
\`\`\`

查找,替换操作

\`\`\`java
int binarySearch(List list, Object key)//对List进行二分查找，返回索引，注意List必须是有序的
int max(Collection coll)//根据元素的自然顺序，返回最大的元素。 类比int min(Collection coll)
int max(Collection coll, Comparator c)//根据定制排序，返回最大元素，排序规则由Comparatator类控制。类比int min(Collection coll, Comparator c)
void fill(List list, Object obj)//用指定的元素代替指定list中的所有元素
int frequency(Collection c, Object o)//统计元素出现次数
int indexOfSubList(List list, List target)//统计target在list中第一次出现的索引，找不到则返回-1，类比int lastIndexOfSubList(List source, list target)
boolean replaceAll(List list, Object oldVal, Object newVal)//用新元素替换旧元素
\`\`\`



## IO

### 体系

\`InputStream\`/\`Reader\`: 所有的输入流的基类，前者是字节输入流，后者是字符输入流。

\`OutputStream\`/\`Writer\`: 所有输出流的基类，前者是字节输出流，后者是字符输出流。

### 字节流

> InputStream

常用方法：

1. \`read()\`：返回输入流中下一个字节的数据。返回的值介于 0 到 255 之间。如果未读取任何字节，则代码返回 \`-1\` ，表示文件结束。
2. \`read(byte b[ ])\`
3. \`read(byte b[], int off, int len)\`
4. \`skip(long n)\`：忽略输入流中的 n 个字节 ,返回实际忽略的字节数
5. \`available()\`：返回输入流中可以读取的字节数。
6. \`close()\`：关闭输入流释放相关的系统资源
7. \`readAllBytes()\`：读取输入流中的所有字节，返回字节数组。
8. \`readNBytes(byte[] b, int off, int len)\`：阻塞直到读取 \`len\` 个字节。
9. \`transferTo(OutputStream out)\`：将所有字节从一个输入流传递到一个输出流

实现：

1. FileInputStream

2. ObjectInputStream

3. RandomAccessFile：可以自由访问文件的任意位置

> 输出流

常用方法：

1. \`write(int b)\`：将特定字节写入输出流。
2. \`write(byte b[ ])\` : 将数组\`b\` 写入到输出流，等价于 \`write(b, 0, b.length)\` 。
3. \`write(byte[] b, int off, int len)\` : 在\`write(byte b[ ])\` 方法的基础上增加了 \`off\` 参数（偏移量）和 \`len\` 参数（要读取的最大字节数）。
4. \`flush()\`：刷新此输出流并强制写出所有缓冲的输出字节。
5. \`close()\`：关闭输出流释放相关的系统资源。

### 字符流

避免乱码问题

> Reader

常用方法：

1. \`read()\` : 从输入流读取一个字符。
2. \`read(char[] cbuf)\` : 从输入流中读取一些字符，并将它们存储到字符数组 \`cbuf\`中，等价于 \`read(cbuf, 0, cbuf.length)\` 。
3. \`read(char[] cbuf, int off, int len)\`：在\`read(char[] cbuf)\` 方法的基础上增加了 \`off\` 参数（偏移量）和 \`len\` 参数（要读取的最大字符数）。
4. \`skip(long n)\`：忽略输入流中的 n 个字符 ,返回实际忽略的字符数。
5. \`close()\` : 关闭输入流并释放相关的系统资源。

> Writer

 常用方法：

- \`write(int c)\` : 写入单个字符。
- \`write(char[] cbuf)\`：写入字符数组 \`cbuf\`，等价于\`write(cbuf, 0, cbuf.length)\`。
- \`write(char[] cbuf, int off, int len)\`：在\`write(char[] cbuf)\` 方法的基础上增加了 \`off\` 参数（偏移量）和 \`len\` 参数（要读取的最大字符数）。
- \`write(String str)\`：写入字符串，等价于 \`write(str, 0, str.length())\` 。
- \`write(String str, int off, int len)\`：在\`write(String str)\` 方法的基础上增加了 \`off\` 参数（偏移量）和 \`len\` 参数（要读取的最大字符数）。
- \`append(CharSequence csq)\`：将指定的字符序列附加到指定的 \`Writer\` 对象并返回该 \`Writer\` 对象。
- \`append(char c)\`：将指定的字符附加到指定的 \`Writer\` 对象并返回该 \`Writer\` 对象。
- \`flush()\`：刷新此输出流并强制写出所有缓冲的输出字符。
- \`close()\`:关闭输出流释放相关的系统资源。

### 字节缓冲流

IO 操作是很消耗性能的，缓冲流将数据加载至缓冲区，一次性读取/写入多个字节，从而避免频繁的 IO 操作，提高流的传输效率。

字节缓冲流这里采用了装饰器模式来增强 \`InputStream\` 和\`OutputStream\`子类对象的功能。

\`\`\`java
// 新建一个 BufferedInputStream 对象
BufferedInputStream bufferedInputStream = new BufferedInputStream(new FileInputStream("input.txt"));
\`\`\`

### 字符缓冲流

\`BufferedReader\` （字符缓冲输入流）

 \`BufferedWriter\`（字符缓冲输出流）
`;export{n as default};
