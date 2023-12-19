import { Config, interpolate } from '@pulumi/pulumi';
import { User, AccessKey, UserPolicy } from '@pulumi/aws/iam/index.js';
import { DomainIdentity, MailFrom, DomainDkim } from '@pulumi/aws/ses/index.js';
import { dnsRecord } from '../cloudflare/dnsRecord.js';

export function createSes(prefix: string, subdomain: string) {
    const config = new Config();
    const baseDomain = config.require('domain');
    const sesRegion = config.require('ses-region');

    const emailUser = new User(
        `${prefix}-usr`,
        {
            name: `${prefix}-email`,
            path: '/system/',
        },
    );

    // Policy
    const allowedFromAddress = `*@${subdomain}.${baseDomain}`;
    new UserPolicy(
        `${prefix}-ses-policy`,
        {
            user: emailUser.name,
            policy: JSON.stringify({
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: [
                            'ses:SendEmail',
                            'ses:SendTemplatedEmail',
                            'ses:SendRawEmail',
                            'ses:SendBulkTemplatedEmail',
                        ],
                        Effect: 'Allow',
                        Resource: '*',
                        Condition: {
                            StringLike: {
                                'ses:FromAddress': allowedFromAddress,
                            },
                        },
                    },
                ],
            }, null, '  '),
        },
    );

    // Email Access key
    const emailAccessKey = new AccessKey(
        `${prefix}-ses-access-key`,
        { user: emailUser.name },
    );

    const sesSmtpUsername = interpolate`${emailAccessKey.id}`;
    const sesSmtpPassword = interpolate`${emailAccessKey.sesSmtpPasswordV4}`;

    const sesDomainIdentity = new DomainIdentity(`${prefix}-domainIdentity`, {
        domain: `${subdomain}.${baseDomain}`,
    });

    // MailFrom
    const mailFromDomain = sesDomainIdentity.domain;
    const mailFrom = new MailFrom(
        `${prefix}-ses-mail-from`,
        {
            domain: sesDomainIdentity.domain,
            mailFromDomain: interpolate`bounce.${sesDomainIdentity.domain}`,
        });

    dnsRecord(`${prefix}-ses-mail-from-mx-record`, `bounce.${subdomain}`, `feedback-smtp.${sesRegion}.amazonses.com`, 'MX', false);
    dnsRecord(`${prefix}-spf`, mailFrom.mailFromDomain, 'v=spf1 include:amazonses.com -all', 'TXT', false);
    dnsRecord(`${prefix}-ses-dmarc`, `_dmarc.${subdomain}`, 'v=DMARC1; p=none; rua=mailto:contact@signalco.io; fo=1;', 'TXT', false);

    const sesDomainDkim = new DomainDkim(`${prefix}-sesDomainDkim`, {
        domain: sesDomainIdentity.domain,
    });
    for (let i = 0; i < 3; i++) {
        const dkimValue = interpolate`${sesDomainDkim.dkimTokens[i]}.dkim.amazonses.com`;
        const dkimName = interpolate`${sesDomainDkim.dkimTokens[i]}._domainkey.${subdomain}`;
        dnsRecord(`${prefix}-dkim${i}`, dkimName, dkimValue, 'CNAME', false);
    }

    return {
        smtpUsername: sesSmtpUsername,
        smtpPassword: sesSmtpPassword,
        smtpServer: `email-smtp.${sesRegion}.amazonaws.com`,
        smtpFromDomain: mailFromDomain,
    };
}
