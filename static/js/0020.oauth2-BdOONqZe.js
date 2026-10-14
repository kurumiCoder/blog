const e=`---
title: oauth2
date: 2026-09-23 20:30:00
permalink: /pages/f5c37c/
categories:
  - java后端
tags:
  - 实用技能
  - oauth2
---

# OAuth 2.0

## 一、OAuth 2.0 是什么

### 定义

OAuth 2.0 是一个**开放授权框架**，标准编号 [RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749)。

一句话：**让第三方应用在不获取用户密码的前提下，拿到用户在某个服务上资源的「有限访问权限」。**

> 划重点：OAuth 2.0 解决的是「**授权**（Authorization，你能干什么）」问题，不是「**认证**（Authentication，你是谁）」问题。
> 所谓「用 GitHub 登录」，本质是：OAuth2 授权拿到用户资料 → 你的应用根据资料建立自己的登录态。
> 真正的「第三方认证」标准是 **OpenID Connect**（OAuth2 之上加了一层 id_token，能证明用户身份），所以严格来说「用 GitHub 登录」用的是 OAuth2 + 用户信息接口，而不是 OAuth2 本身的认证能力。

### 四个角色

| 角色 | 英文 | 以「用 GitHub 登录博客」为例 |
| --- | --- | --- |
| 资源所有者 | Resource Owner | 用户本人 |
| 客户端 | Client | 你的博客网站（前端 + 后端） |
| 授权服务器 | Authorization Server | GitHub（\`github.com/login/oauth/*\`） |
| 资源服务器 | Resource Server | GitHub API（\`api.github.com\`，存着用户的头像、邮箱等资源） |

### 核心名词

| 名词 | 作用 |
| --- | --- |
| \`authorization code\` 授权码 | GitHub 回给前端的临时凭证，**一次性、几分钟有效**，单独拿到没用 |
| \`access_token\` 访问令牌 | 后端拿 code 换来的，访问 GitHub API 的凭证，有 scope 和有效期 |
| \`refresh_token\` 刷新令牌 | access_token 过期后用它换新的，不用用户重新授权 |
| \`scope\` 授权范围 | 权限清单，如 \`read:user user:email\`，最小权限原则 |
| \`client_id\` | 应用的公开标识，可以放在前端 URL 里 |
| \`client_secret\` | 应用的密钥，**只能放后端**，泄露等于别人可以冒充你的应用 |
| \`redirect_uri\` | 授权后回跳的地址，必须在应用后台登记过，防开放重定向 |
| \`state\` | 前端生成的随机串，回跳时原样带回，用于**防 CSRF** |
| PKCE | 公开客户端（SPA/App）防 code 被拦截的机制，后文详解 |

### 四种授权模式

| 模式 | 场景 | 现状 |
| --- | --- | --- |
| 授权码模式 Authorization Code | 有后端的 Web 应用（本笔记重点） | 最主流，推荐 |
| 授权码 + PKCE | SPA、移动 App（无法安全保存 secret） | 主流，推荐 |
| 简化模式 Implicit | 纯前端直接拿 token | 已废弃（token 直接暴露在 URL） |
| 密码模式 Password | 用户直接把密码给客户端 | 已废弃 |
| 客户端凭证 Client Credentials | 机器对机器，无用户参与 | 仍常用（如服务间调用） |

## 二、为什么需要 OAuth 2.0

### 密码反模式（Password Anti-pattern）

OAuth 出现之前，想让第三方网站访问你的 GitHub 数据，只能把 GitHub 账号密码直接填给它。问题很大：

1. **权限过大**：拿到密码 = 拿到账号完全控制权，而不只是"看个头像"
2. **不可撤销**：第三方偷偷用你的账号你也不知道，改密码之前一直有效
3. **第三方泄露 = 你沦陷**：对方数据库被拖库，你的 GitHub 密码就没了
4. **无法限制范围**：没法说"只许读资料，不许改仓库"

### OAuth 的解法

1. 用户**不交密码**，只在你熟悉的 GitHub 页面上点授权
2. **权限最小化**：\`scope\` 限定只能读用户资料
3. **可撤销**：GitHub 设置里的 Applications 随时解除授权
4. **令牌化**：access_token 有有效期、可刷新、可单独撤销，泄露损失有限

> 类比：住酒店给保洁一张**房卡**（只能开你这间、有时间限制、丢了前台能注销），而不是把**家门钥匙**配一把给他。

### 为什么强调「授权码」模式

access_token 是整个流程里最敏感的东西，授权码模式的设计目标是**让它永远不经过浏览器**：

1. 浏览器地址栏/历史/Referer/日志里只会出现一次性的 \`code\`，不是 token
2. \`code\` 换 token 时必须带上 \`client_secret\`，而 secret 只有后端有
3. \`code\` 一次性消费，即使被截获，用过一次就失效

## 三、OAuth 2.0 的流程（以 GitHub 登录/注册为例）

### 前置准备

在 GitHub → Settings → Developer settings → **OAuth Apps** → New OAuth App 注册应用：

- \`Application name\`：应用名（授权页上展示给用户）
- \`Homepage URL\`：应用官网地址，**只展示在授权页的链接上，GitHub 不会去访问校验**，本地开发填 \`http://localhost:5173\` 也可以
- \`Authorization callback URL\`：回跳地址，现在最多可以填 10 个，本地开发可填 \`http://localhost:8080/login/oauth2/code/github\`

> 本地开发提示：Homepage URL 和 callback URL 都允许 localhost。不过 OAuth RFC 8252 更推荐 loopback 字面量 \`http://127.0.0.1:8080/...\`
>
> ——\`localhost\` 和 \`127.0.0.1\` 在回调匹配时算不同主机名，别一边写 \`localhost\` 一边用 \`127.0.0.1\` 请求。新注册的应用回调地址默认**精确匹配**（协议、域名、端口、路径都要求一致），通配符匹配要手动开启。

注册完成后得到 **Client ID** 和 **Client Secret**。

### 时序图

\`\`\`mermaid
sequenceDiagram
    autonumber
    participant U as 用户
    participant F as 前端(浏览器)
    participant B as 后端(Java)
    participant A as GitHub 授权服务器
    participant R as GitHub 资源服务器(API)

    U->>F: 点击「使用 GitHub 登录」
    F->>F: 生成随机 state 存 sessionStorage
    F->>A: 跳转 /login/oauth/authorize?client_id&redirect_uri&scope&state
    A->>U: 展示授权页（未登录 GitHub 则先登录）
    U->>A: 点击 Authorize 同意授权
    A->>F: 302 回 redirect_uri?code=xxx&state=xxx
    F->>F: 校验 state 与本地一致
    F->>B: POST /api/oauth/github/callback { code, state }
    B->>A: POST /login/oauth/access_token（client_id+client_secret+code）
    A-->>B: access_token
    B->>R: GET /user（Authorization: Bearer access_token）
    R-->>B: GitHub 用户资料
    B->>B: 按 GitHub id upsert 本地用户，签发自己的 JWT
    B-->>F: 返回自己的登录 token
    F->>U: 保存登录态，跳转首页
\`\`\`

### 每一步的请求细节

**第 1 步：前端跳转授权页**

\`\`\`text
GET https://github.com/login/oauth/authorize
      ?client_id=Ov23liXXXXXXXXXX
      &redirect_uri=https://blog.example.com/oauth/github/callback
      &scope=read:user%20user:email
      &state=8f3a2c91...
\`\`\`

- \`scope\` 里的多个权限用空格分隔（URL 编码后是 \`%20\` 或 \`+\`）
- 带 PKCE 时额外带 \`code_challenge=xxx&code_challenge_method=S256\`

**第 3 步：GitHub 回跳**

\`\`\`text
https://blog.example.com/oauth/github/callback?code=abc123...&state=8f3a2c91...
\`\`\`

用户点了拒绝授权时，回跳会带 \`error=access_denied\`，没有 code。

**第 5 步：后端用 code 换 token**

\`\`\`text
POST https://github.com/login/oauth/access_token
Accept: application/json
Content-Type: application/json

{
  "client_id": "Ov23liXXXXXXXXXX",
  "client_secret": "********",
  "code": "abc123...",
  "redirect_uri": "https://blog.example.com/oauth/github/callback"
}
\`\`\`

响应：

\`\`\`json
{
  "access_token": "gho_xxxxxxxxxxxx",
  "token_type": "bearer",
  "scope": "read:user,user:email"
}
\`\`\`

> 注意：不加 \`Accept: application/json\`，GitHub 默认返回 \`a=b&c=d\` 的表单格式，容易解析踩坑。

**第 6 步：后端拉用户资料**

\`\`\`text
GET https://api.github.com/user
Authorization: Bearer gho_xxxxxxxxxxxx
\`\`\`

响应包含 \`id\`、\`login\`、\`name\`、\`avatar_url\`、\`email\`（可能为 \`null\`，因为用户没公开邮箱）。

如果 \`email\` 为 null，再调一次（需要 \`user:email\` scope）：

\`\`\`text
GET https://api.github.com/user/emails
Authorization: Bearer gho_xxxxxxxxxxxx
\`\`\`

响应是一个数组，取 \`primary == true && verified == true\` 的那条作为主邮箱。

**第 7 步：本地建档**

按 GitHub 的 \`id\`（稳定且不会变）查本地 \`user\` 表：

- 存在 → 更新头像/昵称，记一次登录
- 不存在 → 插入新用户，即"用 GitHub 完成注册"

然后签发**你自己的 JWT / session**，后面的事就与 OAuth 无关了。

### state 与 PKCE

**state 防 CSRF**：如果不带 state，攻击者可以在自己账号授权后，把回跳 URL（带着自己的 code）诱导受害者点击，受害者就在不知情的情况下登录成了攻击者的账号。前端生成随机 state 暂存，回跳时比对，不一致直接拒绝。

**PKCE 防 code 拦截**（公开客户端必备）：

\`\`\`text
前端：code_verifier = 随机字符串（只留在本地）
      code_challenge = BASE64URL(SHA256(code_verifier))

授权请求带：code_challenge=xxx & code_challenge_method=S256
换 token 时带：code_verifier=原始随机串
GitHub 校验：SHA256(code_verifier) 是否等于当初的 code_challenge
\`\`\`

这样即使 code 被截获，没有 \`code_verifier\` 也换不了 token（SPA 没有 secret 可藏，只能靠这个）。

## 四、前端怎么做

### 三条原则

1. 前端只做两件事：**跳转到授权页**、**把回跳的 code 交给自己的后端**
2. 前端**绝不**接触 \`client_secret\`，**绝不**直接请求 GitHub 的 token 端点（浏览器请求会 CORS 失败，硬要绕过就会暴露 secret）
3. **state 必须校验**，\`redirect_uri\` 必须和 GitHub 后台登记的完全一致（协议、域名、端口、路径一个字符都不能差）

### 写法一：跳转 + 回调（推荐，通用）

\`src/utils/oauth.js\`：

\`\`\`js
// GitHub OAuth App 的 client_id，公开信息，可以放前端
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID

// 必须与 GitHub OAuth App 后台登记的 callback URL 完全一致
const REDIRECT_URI = \`\${window.location.origin}/oauth/github/callback\`

/**
 * 发起 GitHub 授权：生成 state 存本地后整页跳转到 GitHub 授权页
 */
export function loginWithGithub() {
  // state：随机串，用于回跳时防 CSRF；crypto.randomUUID 现代浏览器都支持
  const state = crypto.randomUUID()
  // 存 sessionStorage：同标签页内有效，回跳后还能取到；关闭标签页自动清掉
  sessionStorage.setItem('oauth_state', state)

  // URLSearchParams 会自动做 URL 编码（空格 -> %20 等）
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: 'read:user user:email', // 最小权限：只读资料 + 读邮箱
    state,
  })

  // 整页跳转（不是新开窗口），授权完 GitHub 会 302 回 redirect_uri
  window.location.href = \`https://github.com/login/oauth/authorize?\${params}\`
}
\`\`\`

回调页面 \`src/views/oauth/GithubCallback.vue\`：

\`\`\`vue
<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute() // 用于读取 URL 上的 query 参数
const router = useRouter() // 用于登录成功后跳转
const error = ref('')

onMounted(async () => {
  // GitHub 回跳格式：/oauth/github/callback?code=xxx&state=xxx
  // 用户拒绝授权时：?error=access_denied&error_description=...
  const { code, state, error: oauthError } = route.query

  if (oauthError) {
    error.value = '你取消了 GitHub 授权'
    return
  }

  // 1. 校验 state：与发起登录时存的随机串比对，防 CSRF
  const savedState = sessionStorage.getItem('oauth_state')
  sessionStorage.removeItem('oauth_state') // 一次性，不管成功失败都清掉
  if (!state || state !== savedState) {
    error.value = 'state 校验失败，疑似 CSRF 攻击，已中止'
    return
  }

  try {
    // 2. 把 code 交给自己的后端，由后端换 token、拉资料、建账号、签发登录态
    const { data } = await axios.post('/api/oauth/github/callback', { code, state })

    // 3. 拿到的是「我们自己系统」的 token，不是 GitHub 的 access_token
    localStorage.setItem('access_token', data.data.token)
    router.replace('/') // 用 replace 避免用户回退又触发一次回调
  } catch (e) {
    error.value = e.response?.data?.message || 'GitHub 登录失败，请重试'
  }
})
<\/script>

<template>
  <div class="callback">
    <p v-if="error">{{ error }}</p>
    <p v-else>正在登录，请稍候...</p>
  </div>
</template>
\`\`\`

### 写法二：后端直接负责整段跳转（Spring Security 默认方式）

如果用了 \`spring-boot-starter-oauth2-client\`，后端会暴露一个 \`/oauth2/authorization/github\` 地址，前端只需要：

\`\`\`js
// 一行搞定，state、code 换 token、session 全由 Spring Security 处理
window.location.href = 'http://localhost:8080/oauth2/authorization/github'
\`\`\`

授权成功后后端 302 回前端页面（由 \`successHandler\` 决定），适合想要少写代码、不介意登录态用 session 的项目。

## 五、后端 Java：接入方（让自己网站支持 GitHub 注册/登录）

### 方案一：Spring Security OAuth2 Client（生产推荐）

**依赖**：

\`\`\`xml
<!-- OAuth2 客户端：封装了 state 校验、code 换 token、拉 userinfo 全流程 -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-oauth2-client</artifactId>
</dependency>
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-security</artifactId>
</dependency>
\`\`\`

**application.yml**（GitHub 属于 Spring 内置的 CommonOAuth2Provider，provider 可省略，只配 registration 即可）：

\`\`\`yaml
spring:
  security:
    oauth2:
      client:
        registration:
          github:
            client-id: Ov23liXXXXXXXXXX
            client-secret: \${GITHUB_CLIENT_SECRET}   # 从环境变量读，不要硬编码提交到 git
            scope: read:user,user:email              # yml 里用逗号分隔
            redirect-uri: "{baseUrl}/login/oauth2/code/{registrationId}"
            # {baseUrl} 自动取当前服务地址，{registrationId}=github
\`\`\`

**一句话开启登录**（SecurityConfig）：

\`\`\`java
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final GithubOAuth2UserService githubOAuth2UserService; // 自定义：拉资料 + 本地建档
    private final JwtLoginSuccessHandler jwtLoginSuccessHandler;   // 自定义：签发自己的 JWT

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                // 登录相关端点全部放行
                .requestMatchers("/oauth2/**", "/login/**", "/api/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                // 覆盖默认的 userService：默认只拉 /user，邮箱为 null 时不会补拉 /user/emails
                .userInfoEndpoint(userInfo -> userInfo.userService(githubOAuth2UserService))
                // 登录成功后不再用默认的 session 跳转，而是签发我们自己的 JWT
                .successHandler(jwtLoginSuccessHandler)
            )
            .csrf(csrf -> csrf.disable()); // 前后端分离 + JWT 场景按需关闭；用 session 则保持开启
        return http.build();
    }
}
\`\`\`

**自定义 OAuth2UserService —— GitHub 资料落库建号**：

\`\`\`java
@Slf4j
@Service
@RequiredArgsConstructor
public class GithubOAuth2UserService extends DefaultOAuth2UserService {

    private final UserMapper userMapper;             // MyBatis-Plus 等
    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // 1. 父类默认行为：拿 access_token 调 https://api.github.com/user，返回 OAuth2User
        OAuth2User oAuth2User = super.loadUser(userRequest);
        Map<String, Object> attrs = oAuth2User.getAttributes();

        // 2. GitHub 用户信息的字段：id 是数字且永不改变，login 是用户名（可改）
        Long githubId = ((Number) attrs.get("id")).longValue();
        String login = (String) attrs.get("login");
        // name 未设置的 GitHub 用户返回的是 null，不能直接用 getOrDefault
        String nickname = attrs.get("name") != null ? (String) attrs.get("name") : login;
        String avatar = (String) attrs.get("avatar_url");
        String email = (String) attrs.get("email"); // 用户没公开邮箱时为 null

        // 3. email 为 null 时，用 token 再调 /user/emails 取「primary 且 verified」的邮箱
        if (email == null) {
            email = fetchPrimaryVerifiedEmail(userRequest.getAccessToken().getTokenValue());
        }

        // 4. 按 githubId 查本地用户：有则更新，无则注册（这就是「GitHub 注册」）
        User user = userMapper.selectByGithubId(githubId);
        if (user == null) {
            user = new User();
            user.setGithubId(githubId);
            user.setNickname(nickname);
            user.setAvatar(avatar);
            user.setEmail(email);
            user.setCreateTime(LocalDateTime.now());
            userMapper.insert(user);
            log.info("GitHub 新用户注册: githubId={}, login={}", githubId, login);
        } else {
            user.setNickname(nickname);
            user.setAvatar(avatar);
            userMapper.updateById(user);
        }

        // 5. 放回 attributes 供 successHandler 使用（也可以放数据库主键）
        attrs.put("localUserId", user.getId());
        return oAuth2User;
    }

    /** 调 GitHub /user/emails，返回主邮箱（必须是已验证的，防止拿别人未验证邮箱绑定） */
    private String fetchPrimaryVerifiedEmail(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);                          // Authorization: Bearer xxx
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));      // 要求返回 JSON

        ResponseEntity<List<Map<String, Object>>> resp = restTemplate.exchange(
                "https://api.github.com/user/emails",
                HttpMethod.GET,
                new HttpEntity<>(headers),
                new ParameterizedTypeReference<>() {}
        );

        return Optional.ofNullable(resp.getBody()).orElse(List.of()).stream()
                .filter(m -> Boolean.TRUE.equals(m.get("primary"))   // 主邮箱
                          && Boolean.TRUE.equals(m.get("verified"))) // 且已验证
                .map(m -> (String) m.get("email"))
                .findFirst()
                .orElse(null);
    }
}
\`\`\`

**自定义 successHandler —— 签发自己的 JWT**：

\`\`\`java
@Component
@RequiredArgsConstructor
public class JwtLoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Long userId = ((Number) oAuth2User.getAttributes().get("localUserId")).longValue();

        // 到这里 OAuth 的使命已经结束，后续用的是我们自己的登录态
        String token = jwtUtil.generate(userId);

        // 前后端分离：返回 JSON；传统页面：response.sendRedirect("/")
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write("{\\"code\\":0,\\"data\\":{\\"token\\":\\"" + token + "\\"}}");
    }
}
\`\`\`

### 方案二：手写 HTTP 调用（面试/学习推荐，流程一目了然）

**Controller**：

\`\`\`java
@Slf4j
@RestController
@RequestMapping("/api/oauth/github")
@RequiredArgsConstructor
public class GithubOAuthController {

    @Value("\${github.client-id}")
    private String clientId;

    @Value("\${github.client-secret}")
    private String clientSecret; // 只存在于后端配置

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final RestTemplate restTemplate = new RestTemplate(); // 生产建议 WebClient + 超时配置

    /**
     * 前端回调页拿到 code 后调这里。
     * 整个「code 换 token」必须在后端完成，因为要用 client_secret。
     */
    @PostMapping("/callback")
    public Result<LoginVO> callback(@RequestBody @Valid GithubCallbackDTO dto) {
        // 1. code 换 access_token
        String accessToken = exchangeToken(dto.getCode());

        // 2. 用 access_token 拉 GitHub 用户资料
        GithubUser githubUser = fetchGithubUser(accessToken);

        // 3. email 为空则补拉 /user/emails（需要 user:email scope）
        String email = githubUser.getEmail() != null
                ? githubUser.getEmail()
                : fetchPrimaryEmail(accessToken);

        // 4. 按 githubId upsert 本地用户（注册/登录二合一）
        User user = userService.findOrCreateByGithub(githubUser, email);

        // 5. 签发自己系统的 JWT，返回给前端
        String token = jwtUtil.generate(user.getId());
        return Result.ok(new LoginVO(token, user.getNickname(), user.getAvatar()));
    }

    /** POST https://github.com/login/oauth/access_token，请求体 JSON，客户端凭证放 body */
    private String exchangeToken(String code) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        // 关键：不加 Accept: application/json，GitHub 会返回 form 格式（a=b&c=d）
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        // 注意：GitHub 的 token 端点参数用下划线命名
        Map<String, String> body = new HashMap<>();
        body.put("client_id", clientId);
        body.put("client_secret", clientSecret);
        body.put("code", code);
        // redirect_uri 可选；如果授权时传了，这里建议保持一致

        ResponseEntity<GithubTokenResponse> resp = restTemplate.postForEntity(
                "https://github.com/login/oauth/access_token",
                new HttpEntity<>(body, headers),
                GithubTokenResponse.class);

        GithubTokenResponse tokenResp = resp.getBody();
        if (tokenResp == null || tokenResp.getAccessToken() == null) {
            // GitHub 失败时返回 { "error": "bad_verification_code", ... }
            throw new BizException("GitHub 授权失败: " + (tokenResp == null ? "无响应" : tokenResp.getError()));
        }
        return tokenResp.getAccessToken();
    }

    /** GET https://api.github.com/user，Bearer 认证 */
    private GithubUser fetchGithubUser(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);                     // Authorization: Bearer gho_xxx
        headers.setAccept(List.of(MediaType.APPLICATION_JSON)); // GitHub 要求带 Accept

        ResponseEntity<GithubUser> resp = restTemplate.exchange(
                "https://api.github.com/user",
                HttpMethod.GET,
                new HttpEntity<>(headers),
                GithubUser.class);

        GithubUser user = resp.getBody();
        if (user == null || user.getId() == null) {
            throw new BizException("获取 GitHub 用户信息失败");
        }
        return user;
    }

    /** GET https://api.github.com/user/emails，取 primary + verified 的邮箱 */
    private String fetchPrimaryEmail(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        ResponseEntity<List<Map<String, Object>>> resp = restTemplate.exchange(
                "https://api.github.com/user/emails",
                HttpMethod.GET,
                new HttpEntity<>(headers),
                new ParameterizedTypeReference<>() {});

        return Optional.ofNullable(resp.getBody()).orElse(List.of()).stream()
                .filter(m -> Boolean.TRUE.equals(m.get("primary")))
                .filter(m -> Boolean.TRUE.equals(m.get("verified"))) // 必须已验证，防邮箱伪造
                .map(m -> (String) m.get("email"))
                .findFirst()
                .orElseThrow(() -> new BizException("GitHub 账号没有可用的已验证邮箱"));
    }
}
\`\`\`

**响应映射的 DTO**（GitHub 返回的是下划线命名，用 \`@JsonProperty\` 映射）：

\`\`\`java
@Data
public class GithubTokenResponse {
    @JsonProperty("access_token")
    private String accessToken;   // 访问令牌
    @JsonProperty("token_type")
    private String tokenType;     // 固定 "bearer"
    private String scope;         // 实际授予的权限，如 "read:user,user:email"
    private String error;         // 出错时才有，如 "bad_verification_code"
}

@Data
public class GithubUser {
    private Long id;              // GitHub 用户唯一 ID，永不变，用它做绑定键
    private String login;         // 用户名，可改，不要用来绑定
    private String name;          // 昵称，可能为 null
    private String email;         // 公开邮箱，可能为 null
    @JsonProperty("avatar_url")
    private String avatarUrl;     // 头像地址
}
\`\`\`

**本地建档逻辑**：

\`\`\`java
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;

    @Override
    @Transactional
    public User findOrCreateByGithub(GithubUser githubUser, String email) {
        // 1. 先按 GitHub id 查：老用户，直接更新资料
        User user = userMapper.selectByGithubId(githubUser.getId());
        if (user != null) {
            user.setNickname(githubUser.getName() != null ? githubUser.getName() : githubUser.getLogin());
            user.setAvatar(githubUser.getAvatarUrl());
            userMapper.updateById(user);
            return user;
        }

        // 2. 再按邮箱查：本地已经有同邮箱账号，则绑定 GitHub（而不是新建重复账号）
        if (email != null) {
            user = userMapper.selectByEmail(email);
            if (user != null) {
                user.setGithubId(githubUser.getId());
                userMapper.updateById(user);
                return user;
            }
        }

        // 3. 都没有：新用户注册
        user = new User();
        user.setGithubId(githubUser.getId()); // 唯一索引，防并发重复插入
        user.setNickname(githubUser.getName() != null ? githubUser.getName() : githubUser.getLogin());
        user.setAvatar(githubUser.getAvatarUrl());
        user.setEmail(email);
        user.setCreateTime(LocalDateTime.now());
        userMapper.insert(user);
        return user;
    }
}
\`\`\`

### 两种方案对比

| 维度 | Spring Security OAuth2 Client | 手写 HTTP |
| --- | --- | --- |
| 代码量 | 少（yml + 两个扩展点） | 多（换 token/拉资料/异常全自己写） |
| state 校验 | 框架内置 | 自己实现 |
| 流程透明度 | 黑盒，出问题不好排查 | 每一步都看得见，适合学习/面试 |
| 扩展性 | 标准（登录态用 session，也可换 JWT） | 完全自由 |
| 建议 | 生产项目 | 学习原理，或接入非标准 OAuth 服务 |

### 接入方安全清单

1. \`client_secret\` 只放后端，从环境变量/配置中心读，不提交到 git
2. \`state\` 必须校验，且用一次就作废
3. 绑定键用 GitHub 的 \`id\`，不要用 \`login\`（用户名可改）或邮箱（可被抢注/换绑）
4. 只有 \`verified\` 的邮箱才能作为账号关联依据
5. 已登录状态下「绑定 GitHub」也要校验 state，防 CSRF 换绑攻击
6. 后端换 token / 拉资料要设置超时和重试，GitHub 挂了不能拖垮你的回调接口

## 六、后端 Java：提供方（自己搭一个类似 GitHub 的授权服务器）

> 场景：你的平台积累了一批用户，想让第三方网站也能「用你的平台账号登录」，即你要扮演 GitHub 的角色。

### 需要提供哪些端点（对照 GitHub）

| 端点 | 对应 GitHub | 作用 |
| --- | --- | --- |
| \`GET /oauth2/authorize\` | \`/login/oauth/authorize\` | 展示授权页；用户同意后生成 code 并 302 回 \`redirect_uri\` |
| \`POST /oauth2/token\` | \`/login/oauth/access_token\` | 校验 client + code，签发 access_token |
| \`GET /oauth2/userinfo\` | \`api.github.com/user\` | 用 access_token 换取当前用户信息 |
| \`GET /oauth2/jwks\` | — | 暴露公钥，供第三方验证 JWT 签名 |
| \`POST /oauth2/revoke\` | — | 撤销 token |

另外还需要一个**开发者后台**：第三方来登记应用（应用名、redirect_uri 白名单、可申请的 scope），系统生成 \`client_id\` / \`client_secret\`。这就是 GitHub 的 OAuth Apps 页面。

### 方案一：Spring Authorization Server（官方标准实现）

Spring Security OAuth 项目已停止维护，官方继任者是 **Spring Authorization Server**，适合直接落地生产。

**依赖**：

\`\`\`xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-authorization-server</artifactId>
</dependency>
\`\`\`

**核心配置**：

\`\`\`java
@Configuration
@EnableWebSecurity
public class AuthorizationServerConfig {

    /** 授权服务器自己的安全过滤链，Order(1) 保证先于默认链执行 */
    @Bean
    @Order(1)
    public SecurityFilterChain authorizationServerFilterChain(HttpSecurity http) throws Exception {
        // 应用 OAuth2 授权服务器默认端点与校验（/oauth2/authorize、/oauth2/token 等）
        OAuth2AuthorizationServerConfiguration.applyDefaultSecurity(http);
        // 开启 OpenID Connect 1.0（多了 /oauth2/userinfo、id_token）
        http.getConfigurer(OAuth2AuthorizationServerConfigurer.class)
                .oidc(Customizer.withDefaults());
        return http.build();
    }

    /** 注册第三方应用：相当于 GitHub 后台创建 OAuth App 后存下的那条记录 */
    @Bean
    public RegisteredClientRepository registeredClientRepository() {
        RegisteredClient client = RegisteredClient.withId(UUID.randomUUID().toString())
                .clientId("blog-client")                          // 公开标识
                .clientSecret("{bcrypt}$2a$10$xxxx")              // 必须加密存储
                .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .authorizationGrantType(AuthorizationGrantType.REFRESH_TOKEN)
                .redirectUri("https://third.example.com/callback") // 白名单，精确匹配
                .scope("read:user")                                // 允许申请的权限
                .build();
        // 生产改存数据库（JdbcRegisteredClientRepository）
        return new InMemoryRegisteredClientRepository(client);
    }

    /** 签发 JWT 用的 RSA 密钥对；公钥通过 /oauth2/jwks 暴露给资源服务器验签 */
    @Bean
    public JWKSource<SecurityContext> jwkSource() {
        KeyPair keyPair = KeyPairGenerator.getInstance("RSA").generateKeyPair(); // 生产要持久化
        RSAKey rsaKey = new RSAKey.Builder((RSAPublicKey) keyPair.getPublic())
                .privateKey(keyPair.getPrivate())
                .keyID(UUID.randomUUID().toString())
                .build();
        return new ImmutableJWKSet<>(new JWKSet(rsaKey));
    }

    /** 授权服务器的一些全局地址配置 */
    @Bean
    public AuthorizationServerSettings authorizationServerSettings() {
        return AuthorizationServerSettings.builder()
                .issuer("https://auth.example.com") // 作为签发者写入 JWT 的 iss
                .build();
    }
}
\`\`\`

框架会自动处理：authorize 页面、code 生成与消费、token 签发与刷新、PKCE、jwks 等。

### 方案二：手写核心三端点（理解原理）

**授权码存储（生产应换 Redis 并带 TTL）**：

\`\`\`java
@Component
public class AuthCodeStore {

    /** code -> 授权信息；真实场景放 Redis 并设置 5 分钟过期 */
    private final Map<String, AuthCode> store = new ConcurrentHashMap<>();

    public record AuthCode(String clientId, Long userId, String scope, long expireAt) {}

    /** 生成一次性授权码 */
    public String create(String clientId, Long userId, String scope) {
        String code = UUID.randomUUID().toString().replace("-", ""); // 足够随机，不可预测
        // 5 分钟后过期
        store.put(code, new AuthCode(clientId, userId, scope, System.currentTimeMillis() + 5 * 60_000));
        return code;
    }

    /** 消费授权码：remove 是原子的，保证「一次性」，用第二次拿到 null */
    public AuthCode consume(String code) {
        AuthCode ac = store.remove(code);
        if (ac == null || ac.expireAt() < System.currentTimeMillis()) {
            return null; // 不存在 / 已用过 / 已过期，统一按非法处理
        }
        return ac;
    }
}
\`\`\`

**授权端点（对标 GitHub 的 \`/login/oauth/authorize\`）**：

\`\`\`java
@Controller
@RequestMapping("/oauth2")
@RequiredArgsConstructor
public class AuthorizeController {

    private final OAuthClientService clientService; // 管理第三方登记的应用
    private final AuthCodeStore codeStore;

    /**
     * 第三方把用户引导到这里：
     * /oauth2/authorize?client_id=blog-client&redirect_uri=https://third.example.com/callback
     *                  &scope=read:user&state=abc
     */
    @GetMapping("/authorize")
    public String authorize(@RequestParam("client_id") String clientId,
                            @RequestParam("redirect_uri") String redirectUri,
                            @RequestParam(required = false) String scope,
                            @RequestParam String state,   // 必须原样带回
                            Model model,
                            HttpServletResponse response) throws IOException {
        // 1. 校验应用存在，且 redirect_uri 在登记的白名单里（防开放重定向）
        OAuthClient client = clientService.findByClientId(clientId);
        if (client == null || !client.getRedirectUris().contains(redirectUri)) {
            response.sendError(400, "invalid_client");
            return null;
        }

        // 2. 用户未登录：跳本站登录页，登录后回到本地址继续授权
        Long userId = CurrentUser.getIdOrNull();
        if (userId == null) {
            // 实际可用 request.getRequestURL() + "?" + request.getQueryString() 拼出当前地址
            String backUrl = request.getRequestURL() + "?" + request.getQueryString();
            return "redirect:/login?redirect=" + URLEncoder.encode(backUrl, StandardCharsets.UTF_8);
        }

        // 3. 展示授权页（由前端模板渲染），带上应用名和申请的 scope
        model.addAttribute("clientName", client.getAppName());
        model.addAttribute("scope", scope);
        model.addAttribute("clientId", clientId);
        model.addAttribute("redirectUri", redirectUri);
        model.addAttribute("state", state);
        return "oauth/authorize"; // 模板里是一个「同意授权」表单，POST 到 /oauth2/authorize/confirm
    }

    /** 用户点击「同意授权」后：生成 code，302 回第三方 */
    @PostMapping("/authorize/confirm")
    public void confirm(@RequestParam String clientId,
                        @RequestParam String redirectUri,
                        @RequestParam(required = false) String scope,
                        @RequestParam String state,
                        HttpServletResponse response) throws IOException {
        // 二次校验，防止表单被篡改
        OAuthClient client = clientService.findByClientId(clientId);
        if (client == null || !client.getRedirectUris().contains(redirectUri)) {
            response.sendError(400, "invalid_client");
            return;
        }

        // 生成一次性 code，绑定：哪个应用、哪个用户、什么权限
        String code = codeStore.create(clientId, CurrentUser.getId(), scope);

        // 回跳：redirect_uri?code=xxx&state=xxx（state 原样带回，第三方会比对）
        String target = UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("code", code)
                .queryParam("state", state)
                .build().toUriString();
        response.sendRedirect(target);
    }
}
\`\`\`

**令牌端点（对标 \`/login/oauth/access_token\`）**：

\`\`\`java
@RestController
@RequestMapping("/oauth2")
@RequiredArgsConstructor
public class TokenController {

    private final OAuthClientService clientService;
    private final AuthCodeStore codeStore;
    private final RefreshTokenStore refreshTokenStore;
    private final JwtIssuer jwtIssuer;

    /**
     * 第三方后端来换 token：POST /oauth2/token
     * form 参数：grant_type=authorization_code&code=xxx&client_id=xxx&client_secret=xxx
     */
    @PostMapping("/token")
    public Map<String, Object> token(@RequestParam Map<String, String> params) {
        // 1. 校验客户端身份：client_id + client_secret（也支持 Basic Auth，看实现）
        OAuthClient client = clientService.authenticate(
                params.get("client_id"), params.get("client_secret"));
        if (client == null) {
            throw new OAuthError("invalid_client"); // 按规范应返回 401
        }

        String grantType = params.get("grant_type");
        if ("authorization_code".equals(grantType)) {
            // 2a. 授权码模式：消费 code（一次性！）
            AuthCodeStore.AuthCode ac = codeStore.consume(params.get("code"));
            if (ac == null || !ac.clientId().equals(client.getClientId())) {
                throw new OAuthError("invalid_grant"); // code 不存在/过期/不属于该应用
            }

            // 3. 签发 JWT 格式的 access_token（RS256，有效期 2 小时）
            String accessToken = jwtIssuer.issue(ac.userId(), ac.clientId(), ac.scope(), 7200);
            // refresh_token 存服务端，可撤销
            String refreshToken = refreshTokenStore.create(ac.clientId(), ac.userId());

            return Map.of(
                    "access_token", accessToken,
                    "token_type", "Bearer",
                    "expires_in", 7200,
                    "refresh_token", refreshToken,
                    "scope", ac.scope() == null ? "" : ac.scope()
            );
        }

        if ("refresh_token".equals(grantType)) {
            // 2b. 刷新模式：校验 refresh_token 有效且未被撤销，重新签发
            Long userId = refreshTokenStore.consumeAndGetUserId(params.get("refresh_token"), client.getClientId());
            if (userId == null) {
                throw new OAuthError("invalid_grant");
            }
            String newAccessToken = jwtIssuer.issue(userId, client.getClientId(), "", 7200);
            return Map.of(
                    "access_token", newAccessToken,
                    "token_type", "Bearer",
                    "expires_in", 7200
            );
        }

        throw new OAuthError("unsupported_grant_type");
    }
}
\`\`\`

**用户信息端点（对标 \`api.github.com/user\`）**：

\`\`\`java
@RestController
@RequestMapping("/oauth2")
@RequiredArgsConstructor
public class UserInfoController {

    private final JwtIssuer jwtIssuer;
    private final UserService userService;

    /** 第三方拿着 access_token 来换用户信息 */
    @GetMapping("/userinfo")
    public Map<String, Object> userInfo(@RequestHeader(value = "Authorization", required = false) String auth) {
        // 必须 Bearer 认证
        if (auth == null || !auth.startsWith("Bearer ")) {
            throw new OAuthError("invalid_token");
        }
        String token = auth.substring(7);

        // 验证签名与过期时间；失败抛 401
        JwtIssuer.Claims claims = jwtIssuer.verify(token);
        User user = userService.getById(claims.userId());

        // 返回字段名可以自己约定；OpenID Connect 标准用 sub/name/picture/email
        return Map.of(
                "sub", user.getId(),        // 用户唯一标识（第三方拿它绑定本地账号）
                "name", user.getNickname(),
                "picture", user.getAvatar(),
                "email", user.getEmail()
        );
    }
}
\`\`\`

### 提供方关键安全点

1. **code 一次性**：用 \`remove\` 的原子性保证；重复使用必须报 \`invalid_grant\`
2. **code 绑定 client_id + redirect_uri**：A 应用拿到的 code 不能给 B 应用用
3. **redirect_uri 严格白名单**：绝不接受未登记地址，否则就是开放重定向漏洞
4. **client_secret 加密存储**：数据库泄露也不能直接用；比较时用常量时间比较防时序攻击
5. **access_token 用 JWT + RS256**：私钥签名、公钥经 \`/oauth2/jwks\` 暴露，第三方资源服务器可离线验签
6. **refresh_token 存服务端**：可撤销、可设最长生命周期，撤销接口要有
7. **授权页要展示清楚**：给用户看是哪个应用、要什么权限，不能静默同意
8. **scope 要白名单校验**：第三方申请的权限必须是登记时允许的集合，不能申请什么就给什么

## 七、易混淆点与参考

### 常见误区

1. **OAuth2 ≠ 登录认证协议**：它只解决授权。「第三方登录」的标准化方案是 **OpenID Connect**（OAuth2 上加 \`openid\` scope，返回 \`id_token\` 证明用户身份）
2. **code 换 token 必须在后端**：前端直接换会同时踩 CORS 和 secret 暴露两个坑
3. **access_token 不是给前端用的**：第三方登录场景里，GitHub 的 access_token 只留在后端，前端拿到的是你自己系统的 token
4. **state 不是可选项**：不带 state 的 OAuth 接入等于免费送 CSRF 漏洞
5. **scope 要最小化**：只要 \`read:user\` 能满足需求，就不要申请 \`repo\`

### 参考

- [RFC 6749 - The OAuth 2.0 Authorization Framework](https://datatracker.ietf.org/doc/html/rfc6749)
- [GitHub Docs - Authorizing OAuth apps](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
- [Spring Authorization Server 官方文档](https://docs.spring.io/spring-authorization-server/reference/)
- [Spring Security - OAuth 2.0 Login](https://docs.spring.io/spring-security/reference/servlet/oauth2/login/index.html)
`;export{e as default};
