from gevent import monkey
monkey.patch_all()

from lxml import html
import requests
import re
import json

import gevent.pool
import gevent.queue
from datetime import datetime

pool = gevent.pool.Pool(32)
queue = gevent.queue.Queue()
session = requests.Session()
a = 0
start_time = datetime.now()
json_dict = {}


url = 'http://www.pgshop.com/pgshop-hers/'
regex = re.compile(r"t?([\w]{2,}(?:(?: [\w&]+)?)+)\\")


def worker():
    while True:
        try:
            url, tag = queue.get_nowait()
            scrape(url, tag)
        except gevent.queue.Empty:
            return


def scrape(url, tag):
    global a
    try:
        r = session.get(url)
    except Exception as e:
        print 'ERROR - ', str(e)

    tree = html.fromstring(r.text)
    products = tree.xpath('//p[@class="product-name"]')
    imgs = tree.xpath('//img[contains(@class,"product-image")]//@src')

    for i, pd in enumerate(products):
        p = pd.xpath('.//text()')[1]
        link = pd.xpath('.//@href')[0]
        result = re.sub(r"\\t|\\n", '', repr(p))
        if result != '':
            print 'Found [%s][%s] in %s' % (result, link, tag)
            a += 1
            if tag in json_dict:
                json_dict[tag].append((result, link, imgs[i]))
            else:
                json_dict[tag] = list()
                json_dict[tag].append((result, link, imgs[i]))

r = session.get(url)
tree = html.fromstring(r.text)
a_tags = tree.xpath('//li[@class="menu-item"]//a')
tags = [(x.xpath('.//@href'), repr(x.xpath('.//text()'))) for x in a_tags]

for t in tags:
    url = t[0]
    result = regex.findall(t[1])
    # print url, result
    # scrape(url[0], result[0])
    queue.put((url[0], result[0]))


while not queue.empty() and not pool.full():
    for x in xrange(0, min(queue.qsize(), pool.free_count())):
        pool.spawn(worker)
pool.join()
print a
print 'Time Taken : ', datetime.now() - start_time
with open('data.json', 'w') as fp:
    json.dump(json_dict, fp)
