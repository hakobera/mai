
# Mai

  Mai is an library to send emails, and attachments from node.js to any smtp server
  Mai also support load and management email template.
  Mai is built on [node](http://nodejs.org) and [emailjs](https://github.com/eleith/emailjs).

## Dependencies

Mai is compatible with node 0.4.x.
Mai is depended [emailjs](https://github.com/eleith/emailjs)

## Installation

    $ npm install mai

## Features

  * E-Mail template management

Via [emailjs](https://github.com/eleith/emailjs):

  * works with SSL and TLS smtp servers (ex: gmail)
  * supports smtp authentication (PLAIN, LOGIN, CRAMMD5)
  * emails are queued and the queue is sent asynchronously
  * supports sending html emails and emails with multiple attachments (MIME)

## Emaple

Prepare a email template text file named 'hello.txt' like below, 
and put it in the directory named 'templates'.

    Hello, <%= value %>!

Followings is the code using above template file.

    var Mai = require('mai'),
        conf, mai;

    conf = {
        hostname: 'localhost',
        username: "",
        password: "",
        templatePath: __dirname + '/templates',
        encoding: 'utf-8'
    };

    mai = new Mai(conf);
    
    mai.send({
        from: 'you@x.com',
        to: 'someone@x.com, another@x.com',
        subject: 'Hello Subject',
        templateName: 'hello', // templateName is a filename without extension
        params: {
            value: 'world'
        },
        callback: function(err, message) {
            if (err) {
                console.log('ERROR!');
            } else {
                console.log('SUCCESS');
            }
        }
    });

For all, the variables in the template is replaced given value and you can see the mail body text is

	Hello, world!

## License 

(The MIT License)

Copyright (c) 2011 Kazuyuki Honda <hakobera@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.