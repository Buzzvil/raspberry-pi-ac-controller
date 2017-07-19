#FROM python:2.7
FROM resin/raspberry-pi-python:3.6

# check
# https://github.com/docker-library/buildpack-deps/blob/587934fb063d770d0611e94b57c9dd7a38edf928/jessie/Dockerfile
# for pre-installed apt-get packages

RUN apt-get update && apt-get install -y \
    supervisor \
    unzip \
    lirc \
    ntp \
    i2c-tools \
 && rm -rf /var/lib/apt/lists/*

RUN cd /tmp \
&& wget https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-arm.zip \
&& unzip ngrok-stable-linux-arm.zip \
&& rm -f ngrok-stable-linux-arm.zip \
&& mv ngrok /

COPY requirements.txt /
RUN pip install -r requirements.txt --no-cache-dir

COPY supervisord.conf /etc/supervisor/conf.d/
COPY . /ac
WORKDIR /ac

RUN python manage.py migrate

ENTRYPOINT /ac/entry_point.sh

EXPOSE 8833
