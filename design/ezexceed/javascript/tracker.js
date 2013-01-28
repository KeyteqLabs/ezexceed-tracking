(function(c,a){window.mixpanel=a;var b,d,h,e;b=c.createElement("script");
    b.type="text/javascript";b.async=!0;b.src=("https:"===c.location.protocol?"https:":"http:")+
    '//cdn.mxpnl.com/libs/mixpanel-2.2.min.js';d=c.getElementsByTagName("script")[0];
    d.parentNode.insertBefore(b,d);a._i=[];a.init=function(b,c,f){function d(a,b){
    var c=b.split(".");2==c.length&&(a=a[c[0]],b=c[1]);a[b]=function(){a.push([b].concat(
    Array.prototype.slice.call(arguments,0)))}}var g=a;"undefined"!==typeof f?g=a[f]=[]:
    f="mixpanel";g.people=g.people||[];h=['disable','track','track_pageview','track_links',
    'track_forms','register','register_once','unregister','identify','alias','name_tag',
    'set_config','people.set','people.increment','people.track_charge','people.append'];
    for(e=0;e<h.length;e++)d(g,h[e]);a._i.push([b,c,f])};a.__SV=1.2;})(document,window.mixpanel||[]);

mixpanel.init("24b15c6ffb8804b643e6c75c8fe564d6", {
    cross_subdomain_cookie : true,
    track_pageview : false
});

var parseOpts = function(options)
{
    // Take care of options in stack push that are basic values
    var opts = {};
    for (var key in options) {
        var opt = options[key];
        if (_.isNumber(opt) || _.isString(opt) || _.isBoolean(opt)) {
            opts[key] = opt;
        }
    }
    return opts;
};

var tracker = function(app)
{
    mixpanel.name_tag(app.user.name)

    mixpanel.people.set({
        '$username': app.user.username,
        '$email': app.user.email,
        '$name': app.user.name
    });

    mixpanel.register({
        Domain : window.location.host,
        Name : app.user.name,
        Username : app.user.username,
        Email : app.user.email
    });

    mixpanel.identify(app.user.email);

    app.on({
        'stack:push': function(path, view, options)
        {
            var opts = parseOpts(options);
            opts.stack = 'push';
            mixpanel.track(path, opts);
        },
        'stack:pop': function(path, view, options)
        {
            var opts = parseOpts(options);
            opts.stack = 'pop';
            mixpanel.track(path, opts);
        },
        'all' : function(event)
        {
            if (!event.match('stack')) {
                var opts = parseOpts(_.toArray(arguments)[1]);
                mixpanel.track(event, opts);
            }
        }
    });
};

if (typeof window.eZExceed !== 'undefined')
    tracker(window.eZExceed);
else
    window.onexceed = tracker;
