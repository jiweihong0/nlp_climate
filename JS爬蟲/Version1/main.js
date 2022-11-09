const fetch = require('cross-fetch');
const jsdom = require("jsdom");
const fs = require('fs');
const inputs = ["生態學園", "族群", "群落", "與物種互動", "人口", "能源", "環境地質", "地球資源",
    "固體及有害廢棄物", "生物社會", "生物多樣性", "食物與農業", "環境健康", "毒物危害", "水資源與汙染",
    "環境教育", "氣候與汙染", "永續性與人類發展", "勇於希望", "在地行動", "毫無保留", "氣候焦慮", "氣候行動",
    "在地氣候行動", "氣候變遷法"]


async function main() {
    //創建輸出的檔案
    createExportFile()
    //要給一下Array的開頭 true代表給開頭 false代表結尾
    writeExportFileArray(true)
    for (const input of inputs) {

        console.log(`Searching about ${input}`)

        const url = `https://www.google.com/search?q=${input}&rlz=1C5CHFA_enTW1017TW1017&oq=google+search+api&aqs=chrome..69i57j0i512l9.3587j0j7&sourceid=chrome&ie=UTF-8`
        const result_dom = await getSearchData(url)

        getDataFromDOM(result_dom , input)
        await sleep(3000)
    }
    //結尾時Array的結尾
    writeExportFileArray(false)
    console.log("finished")
}

//取得google搜尋頁面的dom裡的標題,連結,收尋關鍵字
async function getDataFromDOM(dom , input) {
    const list = dom.window.document.querySelectorAll("h3")
    for (const [index,element] of list.entries()) {
        const href = (element.parentElement.href)?.replace("/url?q=", "")
        const title = element.textContent
        //Content的class name是浮動的 只能用相關位置去抓
        const content = element.parentElement?.parentElement?.nextSibling?.querySelector("div > div > div > div > div")?.textContent
        const data = { title: title , content:content ,search_tag:input , href: href}
        if (!data.href || !data.title) continue
        //最後一個時要不能放逗號
        if (input === inputs[inputs.length - 1] && index === list.length - 1) {
            await writeExportFile(data , true)
            break
        }
        await writeExportFile(data)
    }
}

//取得google搜尋頁面的dom
async function getSearchData(url) {
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
        fs.writeFile('result.json', '', (err) => {
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
        fs.appendFile('result.json', `${_data}${islast ? "" : ","}\n`, (err) => {
            if (err) throw err
            else resolve()
        });
    })
    
}

async function writeExportFileArray(isstart) {
    const mark = isstart ? "[" : "]"
    return new Promise((resolve) => {
        fs.appendFile('result.json', mark, (err) => {
            if (err) throw err
            else resolve()
        });
    })
    
}

main()
