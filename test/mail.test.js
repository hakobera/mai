// run with expresso

var Mai = require('../index'),
    assert = require('assert');

var merge = function(a, b) {
    var merged = {}, k;
    
    for (k in a) {
        if (a.hasOwnProperty(k)) {
            merged[k] = a[k];
        }
    }

    for (k in b) {
        if (b.hasOwnProperty(k)) {
            merged[k] = b[k];
        }
    }
    
    return merged;
};

var baseConf = {
    encoding: 'utf-8',
    hostname: 'localhost',
    port: '',
    ssl: false,
    tls: false,
    username: "",
    password: "",
    timeout: 5000,
    domain: "domainname",
    debug: true
};

module.exports = {
    "init": function() {
        var conf = merge(baseConf, {
                templatePath: __dirname + '/templates'
            }),
            mai = new Mai(conf),
            smtp;
        
        smtp = mai.smtpClient.smtp;
        assert.eql(smtp.host, 'localhost');
        assert.eql(smtp.port, 25);
        assert.eql(smtp.ssl, false);
        assert.eql(smtp.tls, false);
        assert.eql(smtp.domain, 'domainname');
        
        assert.eql(mai.templates['text_only'], 'Line1\nLine2\nLine3\nLine4\nLine5');
        assert.eql(mai.templates['embeded'], 'aaa\nbb <%= value %>\nc');
    },
    
    "send text_only": function() {
        var conf = merge(baseConf, {
                templatePath: __dirname + '/templates'
            }),
            mai = new Mai(conf);
        
        var sendInfo = {
            from: 'from@from.com',
            to: 'to1@to.com',
            cc: 'cc1@cc.com, cc2@cc.com',
            bcc: 'bcc1@bcc.com, bcc2@bcc.com',
            subject: 'Mail Subject',
            templateName: 'text_only',
            callback: function(err, message) {
                assert.eql(message.header.from, sendInfo.from);
                assert.eql(message.header.to, sendInfo.to);
                assert.eql(message.header.cc, sendInfo.cc);
                assert.eql(message.header.bcc, sendInfo.bcc);
                assert.eql(message.header.subject, sendInfo.subject);
                assert.eql(message.text, 'Line1\nLine2\nLine3\nLine4\nLine5');
            }
        };
        
        mai.send(sendInfo);
    },
    
    "send embeded": function() {
        var conf = merge(baseConf, {
                templatePath: __dirname + '/templates'
            }),
            mai = new Mai(conf);
        
        var sendInfo = {
            from: 'from@from.com',
            to: 'to1@to.com',
            cc: 'cc1@cc.com, cc2@cc.com',
            bcc: 'bcc1@bcc.com, bcc2@bcc.com',
            subject: 'Mail Subject',
            templateName: 'embeded',
            params: {
                value: 'ABCDE'
            },
            callback: function(err, message) {
                assert.eql(message.header.from, sendInfo.from);
                assert.eql(message.header.to, sendInfo.to);
                assert.eql(message.header.cc, sendInfo.cc);
                assert.eql(message.header.bcc, sendInfo.bcc);
                assert.eql(message.header.subject, sendInfo.subject);
                assert.eql(message.text, 'aaa\nbb ABCDE\nc');
            }
        };
        
        mai.send(sendInfo);
    },

    "send embeded with attachment": function() {
        var conf = merge(baseConf, {
                templatePath: __dirname + '/templates'
            }),
            mai = new Mai(conf);
        
        var sendInfo = {
            from: 'from@from.com',
            to: 'to1@to.com',
            cc: 'cc1@cc.com, cc2@cc.com',
            bcc: 'bcc1@bcc.com, bcc2@bcc.com',
            subject: 'Mail Subject',
            templateName: 'embeded',
            params: {
                value: 'ABCDE'
            },
            attachments: [
                { path: __dirname + '/attachment/attachment1.txt', type: 'text/plain', name: 'rename1.txt' },
                { path: __dirname + '/attachment/attachment2.txt', type: 'text/plain', name: 'rename2.txt' }
            ],
            callback: function(err, message) {
                assert.eql(message.header.from, sendInfo.from);
                assert.eql(message.header.to, sendInfo.to);
                assert.eql(message.header.cc, sendInfo.cc);
                assert.eql(message.header.bcc, sendInfo.bcc);
                assert.eql(message.header.subject, sendInfo.subject);
                assert.eql(message.text, 'aaa\nbb ABCDE\nc');
                
                assert.eql(message.attachments.length, 2);
                
                var attach1 = message.attachments[0],
                    attach2 = message.attachments[1];
                
                assert.eql(attach1, sendInfo.attachments[0]);
                assert.eql(attach2, sendInfo.attachments[1]);
            }
        };
        
        mai.send(sendInfo);
    },

    "ERR: tempaltePath is empty": function() {
        try {
            var mai = new Mai(baseConf);
            throw new Error('fail');
        } catch (err) {
            assert.eql(err.message, "'tmplatePath' is empty");
        }
    },
    
    "ERR: tempaltePath is not exist": function() {
        try {
        var conf = merge(baseConf, {
                templatePath: 'invalid'
            }),
            mai = new Mai(conf);
            throw new Error('fail');
        } catch (err) {
            assert.eql(err.message, "ENOENT, No such file or directory 'invalid'");
        }
    }
    
};