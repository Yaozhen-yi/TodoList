專案說明:使用vue3+mysql來製作,在使用者進入畫面時,在首頁輸入代辦事項點擊新增,會提示使用者要先登入或註冊才能使用。第一次使用的話要先註冊,註冊後再進行登錄,才能使用新增代辦事項的功能。
每位新用戶註冊時,資料庫會記錄自動產生的使用者的id、用戶所輸入的姓名、密碼、信箱及註冊時間,登入後資料庫會自動更新登陸的時間。
每位用戶登入後輸入代辦事項,資料庫會記錄用戶所輸入的代辦事項,並產生代辦事項id、狀態(預設未完成)、用戶id,該用戶只會看到自己輸入的資料。

# todolist

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```
