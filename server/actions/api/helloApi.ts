import { Request, Response } from 'express';

module.exports = {
    rootPath: function(req: Request, res: Response) {
        res.send('Api zostało uruchomione :)');
    }
}