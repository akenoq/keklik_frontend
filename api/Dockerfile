FROM ubuntu:16.04

MAINTAINER brainstorm

RUN apt-get -y update
RUN apt-get install -y python3
RUN apt-get install -y python3-pip

ENV WORK /home
ADD ./ $WORK
WORKDIR $WORK

RUN pip3 install -r requirements.txt
RUN python3 manage.py migrate
RUN python3 manage.py runserver

EXPOSE 80
CMD python3 start.py

