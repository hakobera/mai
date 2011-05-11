var email = require('emailjs'),
    ejs = require('ejs'),
    fs = require('fs');

var DEBUG = false;
var ENV = process.env.NODE_ENV || '';

function debug() {
    if (DEBUG) {
        var args = Array.prototype.slice.apply(arguments),
            i, len;
        
        for (i = 0, len = args.length; i < len; ++i) {
            console.log('[DEBUG][mai]', args[i]);
        }
    }
}

/**
 * @class Send text/html e-mail with mail template management feature.
 * @constructor
 * @param {Object} conf
 */
var Mai = function(conf) {
    var templatePath = conf.templatePath,
        encoding = conf.encoding || 'utf-8',
        files, file, body, templateName, templates = {},
        smtpClient, smtpConf,
        i, len;

    DEBUG = conf.debug || false;
    
    if (!templatePath) {
        throw new Error("'tmplatePath' is empty");
    }
    
    try {
        files = fs.readdirSync(templatePath);
    } catch (err) {
        throw err;
    }
        
    for (i = 0, len = files.length; i < len; ++i) {
        file = files[i];
        body = fs.readFileSync(templatePath + '/' + file, encoding);
        templateName = file.substring(0, file.lastIndexOf('.'));
        templates[templateName] = body;
        debug("Load template '" + file + "'");
    }
    
    this.templates = templates;

    smtpConf = {
        username: conf.username || "",
        password: conf.password || "",
        host: conf.host || 'localhost',
        port: conf.port || null,
        ssl: conf.ssl || false,
        tls: conf.tls || false,
        timeout: conf.timeout || 5000,
        domain: conf.domain || null
    };
    this.smtpClient = new email.server.connect(smtpConf);
    
    debug(this);
    debug('ENV=' + ENV);
};

Mai.prototype = {
    
    /**
     * Send e-mail.
     * 
     * @param {Object} conf Configuration.
     *   - from {String} Sender of the format (address or name <address> or "name" <address>)
     *   - to {String} Recipients (same format as above), multiple recipients are separated by a comma
     *   - cc {String} [optional] Carbon copied recipients (same format as above)
     *   - bcc {String} [optional] Blind carbon copied recipients (same format as above)
     *   - subject {String} Subject of the email
     *   - templateName {String} Template name to send
     *   - params {Object} [optional] Parameter to bind to template
     *   - attachments {Array.<Object>}
     *      - path {String} String to where the file is located
     *      - type {String} String of the file mime type
     *      - name {String} Name to give the file as perceived by the recipient
     *   - callback {Function} [optional] Callback function, which called when send finished.
     */
    send: function(conf) {
        if (!conf) {
            throw new Error("'conf' is required");
        }

        var text, headers, message,
            callback = conf.callback || function(){};

        text = this._buildTemplate(conf.templateName, conf.params);
        headers = this._buildHeaders(conf, text);
        message = email.message.create(headers);
        this._processAttachments(message, conf.attachments);
        
        debug(message);
        
        if (ENV !== 'test') {
            this.smtpClient.send(message, callback);
        } else {
            conf.callback.call(this, null, message);
        }
    },
    
    _buildTemplate: function(templateName, params) {
        var template = this.templates[templateName],
            text;
            
        if (!template) {
            throw new Error("Mail template named '" + conf.templateName + "' is not exist");
        }
        
        text = ejs.render(template, {
            locals: params,
            cache: true,
            filename: templateName
        });
        
        debug(template, text);
        
        return text;
    },
    
    _buildHeaders: function(conf, text) {
        var headers = {
            from: conf.from,
            to: conf.to,
            cc: conf.cc,
            bcc: conf.bcc,
            subject: conf.subject,
            text: text
        };
        
        return headers;
    },
    
    _processAttachments: function(message, attachments) {
        var i, len, attachment;
        if (attachments && Array.isArray(attachments)) {
            for (i = 0, len = attachments.length; i < len; ++i) {
                attachment = attachments[i];
                message.attach(attachment.path, attachment.type, attachment.name);
            }
        }
    }

};

module.exports = Mai;