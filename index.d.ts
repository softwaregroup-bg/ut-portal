import React from 'react';
import ut from 'ut-run';

export type dropdownParams =  string[];
export interface dropdownResult {
    [name: string]: {
        value: any,
        label: string
    } []
}

interface component {
    id: string,
    title: string,
    component: remotePage
}

export interface pageDescriptor {
    title: string,
    icon?: string,
    permission?: string | string[],
    component: (params?: {
        id?: string,
        type?: string,
        layout?: string
    }) => Promise<React.FC<{id?: string}>> | React.FC<{id?: string}>
}

export type remotePage = {
    id: string,
    title: string,
    (params: {}): Promise<pageDescriptor>
}

interface pages {
    [name: string]: () => pageDescriptor
}

export type pageParams = component | remotePage
export type menuItem = Promise<{
    title?: string;
    icon?: string;
    path: string;
    params: {
        id?: string
    }
}>
export type tab = Promise<{
    title?: string;
    icon?: string;
    path: string;
    Component: React.FC;
    params: {
        id?: string
    }
}>
export type action = {
    title?: string;
    action: () => {} | void;
}
export interface handlers<location = ''> {
    [name: `component$${string}`]: remotePage,
    [name: `component/${string}`]: remotePage,
    handleTabShow?: (tab: remotePage | [remotePage, {id: string}] | {tabs: string, params: any}) => {},
    'portal.dropdown.list'?: ut.handler<dropdownParams, dropdownResult, location>,
    portalDropdownList?: ut.handler<dropdownParams, dropdownResult, location>,
    'portal.menu.item'?: (page: pageParams) => menuItem,
    portalMenuItem?: (page: pageParams) => menuItem,
    'portal.tab.item'?: (page: pageParams) => tab,
    portalTabItem?: (page: pageParams) => tab,
    'portal.menu.help'?: (options: {}) => action,
    portalMenuHelp?: (options: {}) => action,
}

export interface errors {
}

interface methods {
    handleDispatchSet?: (dispatch: (action: any) => any) => void
}

export type libFactory = ut.libFactory<methods, errors>
export type handlerFactory = ut.handlerFactory<methods, errors, handlers<'local'>>
export type handlerSet = ut.handlerSet<methods, errors, handlers<'local'>>
export type portalFactory = ut.handlers<handlers, {
    'portal.reports.get'?: () => Promise<{

    }>
    'portal.params.get': () => Promise<{
        theme?: {},
        portalName: string,
        portal?: {
            menu: any,
            menuClass?: string,
            tabs: any,
            hideTabs: boolean
        }
    }>
}>
export type pageSet<methods, errors> = ut.handlerSet<methods, errors, pages | ut.genericHandlers>
export type pageFactory<methods, errors> = ut.handlerFactory<methods, errors, pages>
