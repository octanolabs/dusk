# dusk

> Dashboard for managing a node

## Default Credentials

username: dusk
passphrase: octano

## Supervisor

The following instructions are for ubuntu however should roughly apply elsewhere. This assumes your are running as user 'dusk'.

### Install

``` bash
$ sudo apt-get install supervisor
```

### Configure

``` bash
$ sudo nano /etc/supervisor/supervisord.conf
```

Ensure the following is present (add chown=dusk:dusk). This will restrict access to the supervisor XML-RPC unix socket to the dusk user & group.
```
[unix_http_server]
file=/var/run/supervisor.sock   ; (the path to the socket file)
chmod=0700                       ; socket file mode (default 0700)
chown=dusk:dusk
```

and..

```
[supervisorctl]
serverurl=unix:///var/run/supervisor.sock
```

last..

```
[include]
files = /home/dusk/.dusk/supervisor/*.conf
```

Restart supervisor

``` bash
$ sudo service supervisor restart
```

Verify changes applied

``` bash
$ ls -la /var/run/supervisor.sock
```

```
srwx------ 1 dusk dusk 0 jun 23 17:53 /var/run/supervisor.sock
```

## Build Setup

``` bash
# install dependencies
$ npm run install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
