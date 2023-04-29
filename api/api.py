from flask_restful import reqparse, abort, Api, Resource
from flask import Flask, request
from flask import jsonify
from flask_redis import FlaskRedis
import translators as ts
import random

dog_lan=['ar', 'auto', 'de', 'en', 'es', 'fr', 'hi', 'id', 'it', 'jp', 'kr', 'ms', 'pt', 'ru', 'th', 'tr', 'vi', 'zh']
trs=[ 'baidu', 'bing','cloudYi', 'deepl', 'iciba', 'iflyrec', 'qqFanyi', 'sogou', 'youdao']
parser = reqparse.RequestParser()
parser.add_argument('c', type=str, help='内容')
parser.add_argument('t', type=str, help='目标')

app = Flask(__name__)
app.config.update(RESTFUL_JSON=dict(ensure_ascii=False))
api = Api(app)

app.config['REDIS_URL'] = "redis://:passwd@127.0.0.1:3006/0"
app.config['JSON_AS_ASCII'] = False
rc = FlaskRedis(app, decode_responses=True)
DOGTIME = 43200


import translators as ts
import random

def dog_rd_ts(indog,todog):
    """
    随机翻译
    """
    
    if todog in dog_lan:
        rs=random.choice(trs)
        res=ts.translate_text(indog,translator=rs,to_language=todog)
        outdog=res+" | 由{}翻译".format(rs)
    else:
        outdog = '#&$*#@!@*@&#!'
    return outdog


def dog_rs_fy(c, t, clinfo):
    """
    带有缓存的翻译控制
    """
    if len(c) > 30:
        index_dog = c[:90:3]
    else:
        index_dog = c
    r_dog = 's_{}_{}'.format(t, index_dog)
    rs_dog = rc.get(r_dog)
    if rs_dog == None:
        rr_dog = dog_rd_ts(c, t)
        rc.set(r_dog, rr_dog, ex=DOGTIME)
        rs_dog = rr_dog
        rc.incr("n1")
    else:
        rc.incr("n2")
    return str(rs_dog)


class tsdog(Resource):
    def get(self):
        c = request.args.get("c")
        t = request.args.get("t")
        if c == None:
            r = "@$$%$%^%&&^"
        else:
            r = dog_rs_fy(c, t, 0)
        return r

    def post(self):
        args = parser.parse_args()
        c = args["c"]
        t = args["t"]
        if c == None:
            r = "@$$%$%^%&&^"
        else:
            r = dog_rs_fy(c, t, 0)
        return {"r": r}


api.add_resource(tsdog, '/')

if __name__ == '__main__':
    app.run(debug=True)
