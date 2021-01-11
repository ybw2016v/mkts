FROM python:3
WORKDIR /app

COPY ./docker/api/requirements.txt ./
RUN pip install -r requirements.txt 
# RUN pip install -r requirements.txt  -i https://pypi.tuna.tsinghua.edu.cn/simple


COPY ./docker/api/ . 

CMD ["gunicorn", "api:app", "-c", "./gunicorn.conf.py"]
