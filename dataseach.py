import re
import pandas as pd
import requests
from bs4 import BeautifulSoup
df = pd.read_excel("data.xlsx")
col1 = "title"
col2 = "url"
col3 = "content"

for i in range(700,747):
    try:
        response = requests.get(df.url[i])
        soup = BeautifulSoup(response.text, "html.parser")
        result = soup.find_all("p")
        a=""
        for j in result:
            a+=j.text
        df['content'][i]=a
        print(df.title[i],"成功",i)
    except:
        print(df.title[i],"失敗",i)
        continue
data = pd.DataFrame({col1:df.title,col2:df.url,col3:df['content']})
data.to_excel('data7.xlsx', sheet_name='sheet1', index=True)

# 130-210,216-300,300-400,399-500,499-600