#!/usr/bin/env python3
# IRC Server fuzzing, made easy!

import time
import socket
import select
import random

# settings
hostname = '127.0.0.1'
port = range(6665, 6669), 12345, 2345, 3454
ipv6 = False

nick = 'fuzzclient'
username = 'fu'
realname = 'Fuzzing client'

# strings
valid_chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^*()_-+={}[]\\|<>,.:;'\""


# classes
class IrcConnection:
    """Connects to an IRC server at the given address."""
    def __init__(self, hostname, port, ipv6=False):
        if ipv6:
            family = socket.AF_INET6
        else:
            family = socket.AF_INET

        self.sock = socket.socket(family, socket.SOCK_STREAM)
        self.sock.connect((hostname, port))

        print(self.recv().rstrip())

        # command fuzzing
        self._things_to_send = ['cmd', 'long string']

        self._commands = {}
        self.add_cmd('NICK', args=1)
        self.add_cmd('USER', args=3, last_arg=True)
        self.add_cmd('JOIN', args=1)
        self.add_cmd('PART', args=1)
        self.add_cmd('PASS', args=1)
        self.add_cmd('OPER', args=2)
        self.add_cmd('MODE', args=2)
        self.add_cmd('SERVICE', args=6)
        self.add_cmd('SQUIT', args=2)
        self.add_cmd('TOPIC', args=2, last_arg=True)
        self.add_cmd('NAMES', args=1)
        self.add_cmd('LIST', args=1)
        self.add_cmd('INVITE', args=2)
        self.add_cmd('PRIVMSG', args=2, last_arg=True)
        # self.add_cmd('NOTICE', args=2, last_arg=True)
        self.add_cmd('STATS', args=1)
        self.add_cmd('WHO', args=1)
        self.add_cmd('WHOIS', args=1)
        self.add_cmd('WHOWAS', args=1)
        self.add_cmd('PING', args=1)
        self.add_cmd('PONG', args=1)
        self.add_cmd('SQUERY', args=2, last_arg=True)

    def recv(self, bytes=4096):
        """Receive any info from the IRC server."""
        raw_bytes = self.sock.recv(bytes)
        return raw_bytes.decode('utf-8', 'ignore')

    def send(self, line):
        """Send the given line to the IRC server."""
        self.send_raw('{}\r\n'.format(line))

    def send_raw(self, line):
        """Send the given line to the IRC server."""
        print('->', line)
        if isinstance(line, str):
            line = line.encode('utf-8', 'ignore')
        self.sock.send(line)

    def add_cmd(self, name, args=0, last_arg=False):
        self._commands[name] = (args, last_arg)

    def send_cmd(self, name, args=[], last_arg=None, force=None):
        """Returns either a real or a fuzzed version of the given command."""
        real = random.randint(0, 1)
        if force is True:
            real = True
        elif force is False:
            real = False

        num_of_args, last_arg = self._commands[name]

        if real:
            if last_arg:
                self.send('{name} {args} :{last}'.format(name=name, args=' '.join(args[:-1]), last=args[-1]))
            else:
                self.send('{name} {args}'.format(name=name, args=' '.join(args)))
        else:
            num_of_args += random.randint(-2, 5)
            if num_of_args < 0:
                num_of_args = 0
            new_args = []
            for i in range(num_of_args):
                # random.randint(1, len(response_list)) - 1
                if len(new_args) == num_of_args and random.randint(0, 1):
                    new_args.append(args[i])
                else:
                    if random.randint(0, 1) > 0.7:
                        new_arg = '#'
                    else:
                        new_arg = ''
                    for i in range(0, random.randint(1, 50)):
                        new_arg += random.choice(valid_chars)
                    new_args.append(new_arg)
            if len(new_args) > 1 and random.randint(0, 1):
                self.send('{name} {args} :{last}'.format(name=name, args=' '.join(new_args[:-1]), last=new_args[-1]))
            else:
                self.send('{name} {args}'.format(name=name, args=' '.join(new_args)))

    def send_random(self, what_to_send=None):
        """Send something random! Yay!"""
        if what_to_send is None:
            what_to_send = random.choice(self._things_to_send)

        if what_to_send == 'cmd':
            cmd = random.choice(list(self._commands))
            self.send_cmd(cmd, force=False)
        elif what_to_send == 'long string':
            raw_str = b''
            for i in range(1, random.randint(1, 30)):
                raw_str += bytes((random.randint(1, 255),))
            self.send_raw(raw_str)

# actually run
random.seed()

ports = []

if isinstance(port, (tuple, list)):
    for p in port:
        if isinstance(p, int):
            ports.append(p)
        elif isinstance(p, range):
            for act_port in list(p):
                ports.append(act_port)
elif isinstance(port, int):
    ports.append(port)

while True:
    try:
        actual_port = 6668
        print('Connecting on port', actual_port)

        irc = IrcConnection(hostname, actual_port, ipv6)

        irc.send_cmd('NICK', args=[nick], force=True)
        irc.send_cmd('USER', args=[username, '0', '*', realname], force=True)

        while True:
            # select here to see if we receive anything
            inputready, outputready, exceptready = select.select([irc.sock], [], [], 5)
            if inputready:
                response = irc.recv().rstrip()
                if response.strip():
                    print('<--', response)

            irc.send_random()
    except BrokenPipeError:
        print('We were kicked out. Wait a minute and try again!')
        time.sleep(2)
    except KeyboardInterrupt:
        print('Exiting')
        break
