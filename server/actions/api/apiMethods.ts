module.exports = {
    rootPath: function(req: any, res: any) {
        res.send('Api zostało uruchomione :)');
    },
    otherPage: function(req: any, res: any) {
        res.send('O, a tutaj inna stronka, super!');
    }
}