const fetch = require('cross-fetch');
const jsdom = require("jsdom");
const fs = require('fs');
const inputs = ["永續運輸發展之策略"]


async function main() {
    //創建輸出的檔案
    createExportFile()
    //要給一下Array的開頭 true代表給開頭 false代表結尾
    writeExportFileArray(true)
    for (const input of inputs) {

        console.log(`Searching about ${input}`)
        //取得此搜尋結果的前10筆URL
        const search_url = `https://www.google.com/search?q=${input}&rlz=1C5CHFA_enTW1017TW1017&oq=google+search+api&aqs=chrome..69i57j0i512l9.3587j0j7&sourceid=chrome&ie=UTF-8`
        const result_dom = await getURLDOM(search_url)
        
        const result_urls = getDataFromDOM(result_dom)
        setResults(result_urls , input);
        await sleep(3000)
    }
    //結尾時Array的結尾
    writeExportFileArray(false)
    console.log("finished")
}

//取得google搜尋頁面的dom裡的標題,連結,收尋關鍵字
function getDataFromDOM(dom) {
    const lists = dom.window.document.querySelectorAll("h3")
    const hrefs = Array.from(lists).map(element => {
        const href = (element.parentElement.href)?.replace("/url?q=", "")
        const b = href.indexOf("&")
        const ans = href.substring(0,b)
        const decode = decodeURI(ans)
        return decode
    })
    return hrefs
}

//取得google搜尋頁面的dom
async function getURLDOM(url) {
    return fetch(url)
        .then(res => {
            return res.text()
        })
        .then(html => {
            const doc = new jsdom.JSDOM(html)
            return doc;
        })
        .catch(err => {
            console.log(err)
        })
}

async function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

function createExportFile() {
    return new Promise((resolve) => {
        fs.writeFile('result10.json', '', (err) => {
            if (err) console.log(err)
            else{
                console.log('創建檔案成功');
                resolve();
            }
        });
    })
}

async function writeExportFile(data , islast = false) {
    const _data = JSON.stringify(data);
    return new Promise((resolve) => {
        fs.appendFile('result10.json', `${_data}${islast ? "" : ","}\n`, (err) => {
            if (err) throw err
            else resolve()
        });
    })
    
}

async function writeExportFileArray(isstart) {
    const mark = isstart ? "[" : "]"
    return new Promise((resolve) => {
        fs.appendFile('result10.json', mark, (err) => {
            if (err) throw err
            else resolve()
        });
    })
    
}

//查出每個連結裡的每個 div , span , p 如果裡面包含關鍵字就寫入json
async function setResults(result_urls , input) {
    result_urls.forEach(async(url) => {
        if (!url) return 
        const dom = await getURLDOM(url);
        if (!dom) return
        const texts = dom.window.document.querySelectorAll("div,span,p")
        Array.from(texts).forEach(async(text_element) => {
            const text = washText(text_element.textContent)
            const data = {text:text , input:input , url:url}
            await writeExportFile(data)
          
        })
    })
}

function washText(text) {
    let washed_text = text
    washed_text = washed_text.trim()
    
    //去掉空格
    washed_text = washed_text.replace(/\s/g, '')
    
    //去掉\n
    washed_text = washed_text.replace(/\n/, '')
    return washed_text
}

main()
