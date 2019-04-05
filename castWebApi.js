const Config = require('./lib/config/config');
const Manager = require('./manager');
const Ora = require('ora');
const Table = require('cli-table3');
const prog = require('caporal');

prog
    .version(Config.thisVersion)

    .command('start', 'Start cast-web-api as daemon')
    .option('-H --hostname <host>', 'Hostname cast-web-api webserver should bind to')
    .option('-p --port <port>', 'Port cast-web-api webserver should bind to')
    .option('-d --debug <port>', 'Toggles debugging log messages')
    .option('-a --autoConnect <port>', 'Cast devices auto connect on discovery, devices will reconnect regardless on address change.')
    .option('-r --reconnectTimeout <port>', 'Cast devices trie to reconnect every x ms if it goes down')

    .action((args, options, logger) => {
        let spinner = Ora('Starting cast-web-api').start();
        Manager.start(process.argv)
            .then(value => {
                let table = getTableHead();
                value.forEach(({pid='-', name='-', pm2_env={status: '-'}, address='-'}) => {
                    table.push([pid, name, pm2_env.status, address, pm2_env.pm_out_log_path]);
                });
                spinner.succeed("Started service");
                console.log(table.toString());
            })
            .catch(error => {
                spinner.fail("Error starting cast-web-api:");
            });
    })

    .command('stop', 'Stop the cast-web-api daemon')
    .action((args, options, logger) => {
        let spinner = Ora('Stopping cast-web-api').start();
        Manager.stop()
            .then(value => {
                let table = getTableHead();
                value.forEach(({pid='-', name='-', pm2_env={status: '-'}, address='-'}) => {
                    table.push([pid, name, pm2_env.status, address, pm2_env.pm_out_log_path]);
                });
                spinner.succeed("Stopped service");
                console.log(table.toString());
            })
            .catch(error => {
                spinner.fail("Error stopping cast-web-api:");
                console.log(error);
            });
    })

    .command('status', 'Check status of the cast-web-api daemon')
    .alias('info')
    .action((args, options, logger) => {
        let spinner = Ora('Getting cast-web-api status').start();
        Manager.status()
            .then(value => {
                let table = getTableHead();
                value.forEach(({pid='-', name='-', pm2_env={status: '-', pm_out_log_path:'-'}, address='-'}) => {
                    table.push([pid, name, pm2_env.status, address, pm2_env.pm_out_log_path]);
                });
                spinner.succeed("cast-web-api status");
                console.log(table.toString());
            })
            .catch(error => {
                spinner.fail("Error getting status of cast-web-api:");
                console.log(error);
            });
    });

prog.parse(process.argv);

function getTableHead() {
    return new Table({
        head: ['pid', 'name', 'status', 'address', 'log'],
    });
}