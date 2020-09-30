const Koa = require('koa');

const app = new Koa(); //函數第一個字母一定要大寫

//以下為洋蔥模型(onion model), 以三層為例
app.use(async (ctx, next) => {
    //left side of onion
    console.log('mid1 left', ctx.request.url);
    // 以下a, b兩種寫法計算服務器響應時間, 一定要寫在第一層(洋蔥的最外層)
    ctx.time = Date.now(); //[寫法a]提取起始時間
    const time = Date.now(); //[寫法b]提取起始時間
    await next(); //利用這個中間鍵統計所有流程的執行時間
    //right side of onion
    console.log('mid1 right', ctx.response.body);
    console.log(Date.now() - ctx.time); //[寫法a]結束時間,減去起始時間則能得出所有流程的時間
    const rt = Date.now() - time; //[寫法b] rt為response time
    ctx.set('x-rt', rt); //[寫法b] 回傳response time
});

app.use(async (ctx, next) => {
    //left side of onion
    console.log('mid2 left', ctx.request.url);
    await next();
    //right side of onion
    console.log('mid2 right', ctx.response.body);
});

//core of onion 洋蔥的最核心可以不加next, await參數
app.use(async (ctx) => {
    const res = `Request come from: ${ctx.request.url}`;
    console.log(res);
    ctx.body = res;
});

//設置啟動server本地端口號(此處以6543為例)
//訪問方式為 [http://127.0.0.1:6543] 或 [http://localhost:6543/]
//可使用Postman軟件發送get請求(request), 並查看回應(response)
app.listen(6543, () => {
    console.log('App is listening on: 6543');
});

//後記:請求響應(request and response)模型是http特有的
//但http並沒有規範處理的過程代碼怎麼寫
//koa框架下的洋蔥模型便是一種簡便的方式