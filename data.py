
# coding:utf-8
from ast import Try
import requests
import pandas as pd

module1 = ["生態學園","族群","群落","與物種互動","人口"]
module2 = ["能源","環境地質","地球資源","固體及有害廢棄物"]
module3 = ["生物社會","生物多樣性","食物與農業","環境健康","毒物危害","水資源與汙染"]
module4 = ["環境教育","氣候與汙染","永續性與人類發展"]
module5 = ["勇於希望","在地行動","毫無保留","氣候焦慮","氣候行動","在地氣候行動","氣候變遷法"]
listm = [module1,module2,module3,module4,module5]
listsa = []
for j in range(0,len(listm)):
    for i in range(0,len(listm[j])):
        try:
            for s in range(0,len(listm[j+1])):
                listsa.append([listm[j][i],listm[j+1][s]])
        except:
            break
print(listsa)
# list1 = []
# list2 = []
# col1 = "title"
# col2 = "url"
# for j in listsa:
#     print(j[0],j[1])
#     r = requests.get(f"https://api.avesapi.com/search?apikey=T942JCW3XZMHTJHJVE133QMNJWCF&type=web&query={j[0]}+{j[1]}&google_domain=google.com.tw&gl=tw&hl=zh-tw&device=desktop&output=json&num=10")
#     res = r.json()
#     for i in res['result']['organic_results']:
#         list1.append(i['url'])
#         list2.append(i['title'])

# data = pd.DataFrame({col1:list1,col2:list2})
# data.to_excel('url_data.xlsx', sheet_name='sheet1', index=True)