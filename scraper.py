from lxml import html
import requests
import re

url = 'https://us.pg.com/our-brands'
regex = re.compile(r"(?:(?:\/pg_ourbrands_([\w]+) jpg)|(?:\/PG_([\w]+) jpg))")

r = requests.get(url)
tree = html.fromstring(r.text)
imgs = tree.xpath('//img[contains(@class, "brand-img")]/@src')

for i in imgs:
    result = regex.findall(i)
    if result != []:
        result = result[0]
        result = result[0] if result[0] != '' else result[1]
        print result
