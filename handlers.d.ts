import ut from 'ut-run';
export interface handlers {
}

export interface errors {
}

interface methods {}

export type libFactory = ut.libFactory<methods, errors>
export type handlerFactory = ut.handlerFactory<methods, errors, handlers>
export type handlerSet = ut.handlerSet<methods, errors, handlers>
export type pageFactory = ut.pageFactory<methods, errors>
export type pageSet = ut.pageSet<methods, errors>
