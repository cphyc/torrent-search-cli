#!/usr/bin/env node
var choices = require('choices'),
    search = require('search-kat.ph'),
    open = require('open'),
    path = require('path'),
    cmdLineArgs = require('command-line-args');

var cli = cmdLineArgs([
    {
	name: 'application', alias: 'a', type: String,
	description: 'Application to use to open link. By default use system\'s default application'},{
	name: 'stdout', alias: 's', type: Boolean, defaultValue: false,
	description: 'Output the link to stdout instead of sending it to default application'
    },{
	name: 'query', alias: 'q', type: String, defaultOption: true,
	description: 'The query to search the link'
    },{
	name: 'help', alias: 'h', type: Boolean, defaultValue: false,
	description: 'Print this help'
    }
]);

var options = cli.parse();

if (!options.query || options.help) {
    console.log(cli.getUsage());
    process.exit();
}

search(options.query).then(function(results) {
    choices('Select a torrent', results.slice(0, 9).map(function(r) { return r.name + ' [' + r.size + ' / ' + r.files + ' files] ' + r.seeds + '/' + r.leech; }), function(idx) {
	if (idx === null) {
	    return;
	}
	if (!options.stdout)
       	    open(results[idx].magnet, options.application);
	else
	    console.log(results[idx].magnet)
    });
});
