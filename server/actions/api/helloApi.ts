import { Request, Response } from 'express';

export function rootPath(req: Request, res: Response) {
    res.send('Api zostało uruchomione :)');
}
