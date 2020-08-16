Installing Octano Dusk remotely in Ubuntu 20.04

*Estimated time: 25 minutes.*

For this guide I will be using a [Vultr](https://www.vultr.com/?ref=6840616) cloud compute instance running Ubuntu 20.04. Some prior knowledge is assumed, e.g SSH, linux command line & domain name management.

SSH into your remote server/VPS.

```
root@dusk:~#
```

### dusk user

We need to create a non-root user to run dusk and our client binaries. We will use the command `adduser` for this:

```
adduser dusk
```

You will be asked a few questions, starting with the account password.

Enter a strong password and then just hit ENTER on the remaining fields to skip.

### supervisord

Dusk uses supervisord in the background to manage daemons, we are going to need to install it:

```
apt-get install supervisor
```

As Dusk will run as a non-root user, we need to configure supervisors API so dusk can command it.
Open the config file in a text editor (e.g nano)

```
nano /etc/supervisor/supervisord.conf
```

Ensure the following is present (add chown=dusk:dusk) in the unix_http_server section. This will restrict access to the supervisor XML-RPC unix socket to the dusk user & group.

```
[unix_http_server]
file=/var/run/supervisor.sock   ; (the path to the socket file)
chmod=0700                       ; socket file mode (default 0700)
chown=dusk:dusk
```

And in the supervisorctl section:

```
[supervisorctl]
serverurl=unix:///var/run/supervisor.sock
```

Last, we need to tell supervisor to use a config directory dusk can write to, and the end of the config change the include section to:

```
[include]
files = /home/dusk/.dusk/supervisor/*.conf
```

Restart supervisor

```
service supervisor restart
```

Verify the changes have applied:

```
ls -la /var/run/supervisor.sock
```

```
srwx------ 1 dusk dusk 0 Aug 14 16:31 /var/run/supervisor.sock
```

The user and group should both be 'dusk'.

### nodejs

We are going to need nodejs installed, at present version 12.x is best supported so we will go with that.

```
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Additional build tools:
```
apt-get install -y build-essential
```

### caddy (https/domain)

For domains I use namecheap, but any registrar will do. I will be setting up dusk-kr.octano.dev

Add an A record to your DNS record, e.g:

```
type: A Record
host: dusk-kr
value: [YOUR SERVER IP]
TTL: automatic
```

We will be using caddy as a reverse proxy, accepting requests from the outside world, forwarding them to a dusk instance listening on localhost:3000. Caddy also manages letsencrypt automatically which is great.

Go to the [caddy downloads page](https://caddyserver.com/download)

We dont need any additional packages so right click the download button and copy link address. We will use `wget` to download the caddy binary on the server. Ensure the url is enclosed within quotes "url" to keep it intact. The -O flag will be used to name the output file manually e.g:

```
wget "https://caddyserver.com/api/download?os=linux&arch=amd64&idempotency=55789041402624" -O caddy
```

Ok, now we will set up caddy, first we must prepare the binary.

```
mv ./caddy /usr/bin/
chmod +x /usr/bin/caddy
```

Now we must create a caddy file containing our settings. Caddy requires very minimal configuration, so this step is easy.

```
mkdir /etc/caddy
nano /etc/caddy/caddy.conf
```

Enter

```
{
    email [YOUR EMAIL]
}

[DOMAIN NAME]
reverse_proxy http://127.0.0.1:3000 {
  header_up X-Forwarded-Ssl on
  header_up Host {host}
  header_up X-Real-IP {remote}
  header_up X-Forwarded-For {remote}
  header_up X-Forwarded-Port {server_port}
  header_up X-Forwarded-Proto {scheme}
  header_up X-Url-Scheme {scheme}
  header_up X-Forwarded-Host {host}
}
encode gzip
```

E.g:

```
{
    email no-reply@octano.dev
}

dusk-kr.octano.dev
reverse_proxy http://127.0.0.1:3000 {
  header_up X-Forwarded-Ssl on
  header_up Host {host}
  header_up X-Real-IP {remote}
  header_up X-Forwarded-For {remote}
  header_up X-Forwarded-Port {server_port}
  header_up X-Forwarded-Proto {scheme}
  header_up X-Url-Scheme {scheme}
  header_up X-Forwarded-Host {host}
}
encode gzip
```

Save and exit.

### dusk

Switch to the dusk user:

```
su - dusk
```

Clone the dusk repo:

```
git clone https://github.com/octanolabs/dusk.git
cd dusk
```

Install dependencies:

```
npm install
```

Before we build we need to export some environmental variables.

```
export BASE_URL="https://[YOUR DOMAIN]"
```

E.g:

```
export BASE_URL="https://dusk-kr.octano.dev"
```

build:

```
npm run build
```

### final steps

Now we must configure supervisor to run both caddy and dusk. This will ensure they both restart on server reboot, or if they crash for any reason.

The supervisor config directory was set to /home/dusk/.dusk/supervisor earlier in the tutorial, this is where we need to create our supervisor configs. but First we must make sure it exists.

Still as the dusk user:

```
mkdir -p ~/.dusk/supervisor
```

First we will set up caddy

```
nano ~/.dusk/supervisor/caddy.conf
```

Enter

```
[program:caddy]
command=/usr/bin/caddy run --config /etc/caddy/caddy.conf --adapter=caddyfile
autostart=true
autorestart=true
stderr_logfile=/var/log/caddy.err.log
stdout_logfile=/var/log/caddy.out.log
```

Save and exit.

Now dusk

```
nano ~/.dusk/supervisor/dusk.conf
```
...

```
[program:dusk]
command=/usr/bin/npm run start
directory=/home/dusk/dusk
user=dusk
autostart=true
autorestart=true
stderr_logfile=/var/log/dusk.err.log
stdout_logfile=/var/log/dusk.out.log
```

Save and exit.

Switch back to root user

```
exit
```

Update supervisord

```
supervisorctl reread
supervisorctl update
```

Visit https://[YOUR DOMAIN] in your preferred browser.

In the Dusk login prompt, login with the following:

username: dusk
passphrase: octano
