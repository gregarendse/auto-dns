# Auto DNS
Automatically update DNS entries when external IP address changes.

Auto DNS is designed to poll your external IP address by making a request to an external IP provider, by default ipify.org. The response, you external IP is compared to you last know IP address. If the IP address changes then Auto DNS will update the DNS entry. Ths intened use is in conjuction with a cron job which will trigger auto dns to check the external IP on a set interval.

Currently Freenom is the only supported DNS provider. 

Example usage:

```
$ auto-dns
Usage:  <command> [options]

Options:

  -V, --version                  output the version number
  -c, --config <config>          Config file location (default: /etc/freenom/config.json)
  -l, --list                     List DNS entries
  -u, --update                   Add/Edit DNS records
  -i, --ip-service <ip-service>  Specifiy the IP service used to get external IP [ipify] (default: ipify)
  -s, --state <state>            Location of state file (default: /tmp/freenom/state.json)
  -h, --help                     output usage information

Commands:

  freenom                        Use Freenom DNS

```

# Getting Started

Install dependecies:

```
npm install
```

Build the project:

```
npm run build
```

Create self contained executable:

```
npm run package
```

