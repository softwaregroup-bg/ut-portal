import ut from 'ut-run';
export interface handlers {
}

export interface errors {
}

interface methods {}

export type libFactory = ut.libFactory<methods, errors>
export type handlerFactory = ut.handlerFactory<methods, errors>
export type handlerSet = ut.handlerSet<methods, errors>
