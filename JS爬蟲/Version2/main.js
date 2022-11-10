const fetch = require('cross-fetch');
const jsdom = require("jsdom");
const fs = require('fs');
// const inputs = ["氣候變遷 海岸領域",
//     "台灣海岸環境 氣候變遷",
//     "海平面變動 氣候變遷",
//     "海岸管理法 氣候變遷a",
//     "海岸環境保護 氣候變遷",
//     "海岸空間防護 氣候變遷a",
//     "海岸政策 氣候變遷a"]
const inputs = [
    "海岸管理法 氣候變遷",
    "海岸空間防護 氣候變遷",
    "海岸政策 氣候變遷"]    

async function main() {
    //創建輸出的檔案
    await createExportFile()
    //要給一下Array的開頭 true代表給開頭 false代表結尾
    await writeExportFileArray(true)
    for (const input of inputs) {

        console.log(`Searching about ${input}`)
        //取得此搜尋結果的前10筆URL
        const search_url = `https://www.google.com/search?q=${input}&rlz=1C5CHFA_enTW1017TW1017&oq=google+search+api&aqs=chrome..69i57j0i512l9.3587j0j7&sourceid=chrome&ie=UTF-8`
        const result_dom = await getURLDOM(search_url)
        
        const result_urls = getDataFromDOM(result_dom);
        await sleep(3000)
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
    let data = [];
    try {
        for (let i = 0; i < lists.length;i++){
            console.log(lists[i].parentElement.href)
            const href = (lists[i].parentElement.href)?.replace("/url?q=", "")
            const b = href.indexOf('&')
            const ans = href.substring(0,b)
            const decode = decodeURIComponent(String(ans))
            data.push(decode)
        }
    } catch (error) {
        console.log(error)
        
    }
    // Array.from(lists).map(element => {
    //     const href = (element.parentElement.href)?.replace("/url?q=", "")
    //     try {
    //         const b = href.indexOf('&')
    //         const ans = href.substring(0,b)
    //         const decode = decodeURIComponent(String(ans))
    //         data.push(decode)
    //         return decode
    //     } catch (error) {
    //         console.log(error)
    //     }
       
    // })
    const aa = []
    for (let i in data) {
        if(data[i].includes(".pdf")){
            console.log(data[i])
        }
        else if(data[i].includes(".doc")){
            console.log(data[i])
        }
        else{
            aa.push(data[i])
        }
    }
    return aa
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
        fs.writeFile('模組三缺_海岸領域.json', '', (err) => {
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
        fs.appendFile('模組三缺_海岸領域.json', `${_data}${islast ? "" : ","}\n`, (err) => {
            if (err) throw err
            else resolve()
        });
    })
    
}

async function writeExportFileArray(isstart) {
    const mark = isstart ? "[" : "]";
    await sleep(3000)
    return new Promise((resolve) => {
        fs.appendFile('模組三缺_海岸領域.json', mark, (err) => {
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
        const texts = dom.window.document.querySelectorAll("p,h1,h2,h3,h4,h5,h6,pre")
        let data ="";
        try {
            for(let i = 0; i < texts.length; i++) {
                // console.log(texts[i].innerText)
                data+= await washText(texts[i].textContent) ;
            }
        } catch (error) {
            console.log(error)
        }
        
        const a = {input:input , url:url , text:data }
        await writeExportFile(a)
        // Array.from(texts).forEach(async(text_element) => {
        //     const text = washText(text_element.textContent)
        //     const data = {text:text , input:input , url:url}
        //     await writeExportFile(data)
        //     await sleep(3000)

        // })
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
