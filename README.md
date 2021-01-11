# mkts
A Translation Script for Misskey Note | 一个用于misskey贴文的翻译脚本

后端基于python的[UlionTse/translators](https://github.com/UlionTse/translators)多后端翻译的库，前端是手写的JavaScript，适用于misskey近期版本。由于未对misskey程序作任何更改，只要misskey的前端结构不发生巨大的变化，该脚本将一直保持可用。

## 使用方式

下面两种方式任选一种即可。强烈建议自建后端API服务。建好api后端将脚本中的`ApiUrl = 'https://test1-api.dogcraft.top/ts/';`url换成自建的api地址即可。

* **浏览器脚本(Tampermonkey)**

到[greasyfork](https://greasyfork.org/zh-CN/scripts/419966)找到[mkts](https://greasyfork.org/zh-CN/scripts/419966)，按照提示安装用户端脚本，安装成功后在设置里面的匹配规则里加入自己所在的实例url即可。


* **nginx直接插入**

前一种方式仅适用与在可以有Tampermonkey的设备上，某些移动端浏览器并没有这个功能，可以通过nginx的 `ngx_http_sub_module `模块在html的头部插入JavaScript脚本，具体可以见[这里](https://dogcraft.top/archives/196/)。

首先把[server](./server.js)放置在静态文件服务器里(github、nginx、cdn等)然后修改misskey的nginx配置文件，在`location`下面添加一行`sub_filter '<script>' '<script src="https://url/to/your/server.js"></script><script>';`

完整的`location`应该是这样的

```
location / {
  sub_filter  '<script>'  '<script src="https://www.dogcraft.top/misskey.js"></script><script>';
      proxy_pass http://127.0.0.1:3003;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto https;
      proxy_set_header Accept-Encoding "";
      proxy_http_version 1.1;
      proxy_redirect off;

      # For WebSocket
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection $connection_upgrade;

      # Cache settings
      proxy_cache cache1;
      proxy_cache_lock on;
      proxy_cache_use_stale updating;
      add_header X-Cache $upstream_cache_status;
  }
```
刷新等生效就可以了。

## 后端翻译API

后端主要是用flask_restful与translators拼接起来，并用redis做缓存。

使用时可用参照flask的文档中的标准部署方式，并把redis的配置url改成自己的就可以了。

如果没有flask等python框架的使用经验，推荐采用docker方式。

### docker方式

docker方式很简单，首先要有docker全家桶。

```
git clone https://github.com/ybw2016v/mkts.git
git pull
docker-compose up -d

```

即可。

还可以与misskey共用一个nginx配置,在misskey的配置文件内部添加一个location配置即可。

```
location /translate/ {
   proxy_set_header Host $http_host;
   proxy_pass http://127.0.0.1:5002;
}
```
