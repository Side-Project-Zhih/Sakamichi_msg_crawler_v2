# sakamichi MSG crawler
-- -
快速下載message資料保存在database  
並有簡易server讓你瀏覽msg

**坂道都有支援**  

如果有新功能通常都是櫻坂先，因為我偏心。。。。

### 有成功的請幫我按星星!!!!有問題請在issue發問  
### 另外該流程安裝前製流程 part1 part3 與blogCrawler 一致，使用方法也為相同邏輯，查詢指令請用 --help (下面有寫)

&emsp;


## 安裝前置
### part 1
-- -
1. 請先安裝mongoDB 跟 mongoDB 的GUI studio 3T
2. 建立local端地連線
+ 請參考[mongodb_set_up.md](/mongodb_set_up.md)
3. nodejs 版本請16.0.0 以上，編輯器隨意，建議是vscode，這部分是因為方便當我有更新code時候直接用git 指令就可以做更新，
* 作者windows的exe目前沒包，有高機率不會包成exe出來，~~原因是作者偷懶懶惰~~

PS: mongodb gui只是介面讓你好看的mongodb儲存的資料，他是免錢請放心，進階功能才要錢
### part 2
-- -
**請先想辦法取得refresh token**，  
具體方法我只能提供ios裝置上好用的app，"stream"  
這個app可以方便你查看request讓你找出refresh token
至於具體怎麼找可以看這位大哥寫的  
(是日文所以建議看自行google一下)  
+ [連結底加](https://github.com/proshunsuke/colmsg/blob/main/doc/how_to_get_refresh_token.md)  

PS : 切記不能流漏refresh token給別人，因為他人可以透過這個拿走你訂閱的相關資訊喔，若不慎外漏，請盡速登出再登入，refresh token會更新 

PS : 建議是使用ios進行操作，原因是取出token不需要做裝置切換，電腦的code，跟手機不衝突同時看，若是安卓是會要切換裝置(電腦切手機，手機再切電腦，同時只能一台裝置，要一直更新refresh token)
### part 3
-- -
請將找到的refresh token丟到.env內  
可以將 .env.example 改檔名為 .env即可  
並把你的refresh token填到對應的位置

ex: 櫻坂的token: karin-ten-hikaru-hono-<3
````
SAKURA_REFRESH_TOKEN=karin-ten-hikaru-hono-<3
````

PS 另外 port=3000 保持原狀即可



## 注意事項
1. public 該資料夾不能刪，因為圖片都是從這裡讀，刪掉就要重新下載，但目前作者我有點忙，沒時間做重新下載的功能，""所以刪掉 = 你要從資料庫刪資料，才能重跑""
2. 一次只能載一個團體的
3. 建議寫bat檔好方便下載
4. 檔案結構大致如下:   
請將.env / index.js 放在最外層。  
index.js 是用來執行閱讀器用的
### 簡單來說!!! 不要亂刪檔案!! 不做死就不會死!!!
````
├─middleware
├─public
│  ├─css
│  ├─hinata
│  │  ├─phoneImage
│  │  └─profile
│  ├─nogi
│  │  ├─phoneImage
│  │  └─profile
│  └─sakura
│      ├─phoneImage
│      └─profile
├─src
│
└─views
│   └─layouts
├─index.js
├─handlebar_helper.js
└─.env

````


## 使用方式
### nodejs
-- -
```
# 安裝相關套件
npm install

# 編譯typescript file
tsc: build - tsconfig.json

# 執行

node dst/app.js -g sakura 
(這樣就會下載所有你訂閱的member message)

# 瀏覽

node index.js

隨後
1. 打開網頁
2. 點選網址列
3. 輸入http://localhost:3000
即可開始閱讀

```

### exe
-- -
~~我懶惰波所以沒有~~  
  


## 功能 feature

### EX:舉例
```` bash
# nodejs 
node dst/app.js -g sakura
node dst/app.js -s

以此類推 '-'開頭的可抽換以下的options，請自行觀看
也可輸入
node dst/app.js --help 
查看指令

# exe
${path}/msgCrawler -g sakura
````
### options

````
--version                                Show version number         [boolean]
-g, --group                              chose group sakura / nogi / hinata   
                                         ex: -g sakura                [string]
-m, --members                            input member id ex: -m 21, if you    
                                         want to download  multiple members   
                                         please input ex: -m 21 11     [array]
-s, --showSakuraMember                   show sakurazaka member id   [boolean]
-n, --showNogiMember                     show nogizaka member id     [boolean]
-h, --showHinataMember                   show hinatazaka member id   [boolean]
--updateMemberList, --update_member      update member list, please input     
                                         group name ex: --update_member nogi  
                                                                      [string]
--updatePhoneImage, --update_phone       update phone image, please input
                                            group name ex: --update_image nogi
                                                                      [string]
````
